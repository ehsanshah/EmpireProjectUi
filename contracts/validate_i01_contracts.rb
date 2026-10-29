# frozen_string_literal: true
# Proposed BFF structure and local Engine schema mapping checks; not staging integration.
require 'yaml'
require 'json'
require 'pathname'

root = Pathname.new(__dir__)
live_source = root.join('../src/core/httpClient.ts').read
raise 'fixed Sprint Live lookup returned' if live_source.match?(/resolveWorkItemKey[^\n]*sprint-12/)
raise 'unsafe Live transition cast returned' if live_source.match?(/async transition\([^\n]*(?:as WorkItem|as Receipt)/)
bff = YAML.load_file(root.join('BFF_I01_PROPOSED.openapi.yaml'))
events = JSON.parse(root.join('I01_EVENT_MAPPING.json').read)
raise 'BFF must remain partially proposed' unless bff['x-contract-status'] == 'partial-i01b-implementation-unconfigured'
raise 'wrong OpenAPI version' unless bff['openapi'] == '3.1.0'
raise 'dev bearer exposed' if bff.dig('components', 'securitySchemes').key?('bearer')

paths = bff.fetch('paths')
paths.each do |path, spec|
  declared = Array(spec['parameters']).map { |p| p.fetch('$ref').split('/').last.downcase }
  path.scan(/\{([^}]+)\}/).flatten.each { |name| raise "missing path parameter #{path}/#{name}" unless declared.include?(name.downcase) }
  spec.each do |verb, operation|
    next if verb == 'parameters'
    raise "unlabeled #{path}" unless operation.fetch('operationId').start_with?('proposed')
    raise "missing Engine status #{path}" unless operation.dig('x-engine', 'status')
    raise "missing responses #{path}" unless operation['responses']&.any?
    next unless verb == 'post'
    headers = Array(operation['parameters']).map { |p| p.fetch('$ref').split('/').last }
    raise "CSRF/Origin gap #{path}" unless %w[Csrf Origin].all? { |h| headers.include?(h) }
  end
end

session = paths.fetch('/api/session').fetch('get')
raise 'session falsely mapped to Engine' unless session.dig('x-engine', 'status') == 'missing'
key = paths.fetch('/api/ep/v1/orgs/{org}/projects/{project}/work-items/by-key/{key}').fetch('get')
raise 'key resolver falsely verified' unless key.dig('x-engine', 'status') == 'missing'
transition = paths.fetch('/api/ep/v1/orgs/{org}/projects/{project}/work-items/{item}/transitions').fetch('post')
raise 'transition fields silently omitted' unless bff.dig('components', 'schemas', 'TransitionInput', 'properties').key?('fields') && transition.fetch('description').include?('fail closed')
raise 'async result falsely proposed' if transition.fetch('responses').key?('202')
raise 'missing SSE scope' unless events.dig('cursor', 'scope') == %w[org_id project_id permission_revision]
raise 'SSE falsely treated as receipt' unless events['eventIsReceipt'] == false
raise 'missing revocation action' unless events.dig('events', 'access_revoked', 'action') == 'close-stream-and-purge-scope'
raise 'cursor conflated with event id' unless events.dig('cursor', 'distinctFrom').include?('data.event_id')

sample = {
  'event_id' => 'evt-7', 'event_type' => 'work_item.transitioned.v1', 'schema_version' => 1,
  'org_id' => 'o-1', 'project_id' => 'p-2', 'aggregate_id' => 'wi-3',
  'aggregate_version' => 4, 'permission_revision' => 'grant-5', 'correlation_id' => 'cor-6',
  'occurred_at' => '2026-10-29T12:00:00Z', 'payload' => {'changed_fields' => ['status_id']}
}
mapped = events.fetch('dataFields').filter_map do |from, to|
  value = from.split('.').reduce(sample) { |v, part| v.is_a?(Hash) ? v[part] : nil }
  [to, value] unless value.nil?
end.to_h
raise 'event identity mapping' unless mapped.values_at('eventId', 'orgId', 'projectId', 'aggregateId', 'aggregateVersion') == ['evt-7', 'o-1', 'p-2', 'wi-3', 4]
raise 'event type mapping' unless events.dig('events', sample['event_type'], 'uiEventType') == 'WorkItemUpdated'
raise 'changed fields mapping' unless mapped['changedFields'] == ['status_id']

engine_root = Pathname.new(ARGV[0] || root.join('../../EmpireProject').expand_path.to_s)
engine_files = {
  'project-access' => engine_root.join('contracts/openapi/project-access.v1.yaml'),
  'work-core' => engine_root.join('contracts/openapi/work-core.v1.yaml')
}
if engine_files.values.all?(&:file?)
  engine = engine_files.transform_values { |file| YAML.load_file(file) }
  expected = {
    'project-access' => %w[listProjects getProject],
    'work-core' => %w[listWorkItems queryView getWorkItem listAvailableTransitions transitionWorkItem workItemHistory wcCommandByKey projectEventStream]
  }
  expected.each do |service, ids|
    actual = engine.fetch(service).fetch('paths').values.flat_map { |v| v.values.filter_map { |op| op.is_a?(Hash) ? op['operationId'] : nil } }
    raise "missing Engine operation #{service}: #{(ids - actual).join(', ')}" unless (ids - actual).empty?
  end
  engine_project_fields = engine.fetch('project-access').dig('components', 'schemas', 'Project', 'required')
  browser_project_fields = bff.dig('components', 'schemas', 'Project', 'required')
  missing_project_fields = engine_project_fields - browser_project_fields
  raise "BFF Project drops required Engine fields: #{missing_project_fields.join(', ')}" unless missing_project_fields.empty?
  wc = engine.fetch('work-core')
  engine_transition = wc.dig('paths', '/v1/orgs/{org}/projects/{project}/work-items/{item}/transitions', 'post', 'requestBody', 'content', 'application/json', 'schema')
  raise 'Engine transition unexpectedly changed; reconcile again' unless engine_transition.fetch('properties').keys.sort == %w[reason transition_id]
  raise 'Engine transition unexpectedly async; reconcile again' if wc.dig('paths', '/v1/orgs/{org}/projects/{project}/work-items/{item}/transitions', 'post', 'responses').key?('202')
  raise 'Engine WorkItem key resolver found; reconcile again' if wc.fetch('paths').keys.any? { |p| p.include?('/by-key/{key}') }
  engine_events = wc.dig('components', 'schemas', 'StreamEvent', 'required')
  %w[event_id event_type org_id project_id aggregate_id aggregate_version permission_revision].each { |field| raise "missing SSE field #{field}" unless engine_events.include?(field) }
  puts 'I01-A local Engine OpenAPI shape: PASS (checkout only, no staging calls)'
else
  puts 'I01-A local Engine OpenAPI shape: SKIP (sibling checkout unavailable)'
end
puts 'I01-A proposed BFF and synthetic event mapping: PASS (not Live integration)'
