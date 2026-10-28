"""Structural checks for proposed Phase 02 slices; not server conformance."""
import json
import re
from pathlib import Path

root = Path(__file__).parent
api = json.loads((root / 'PHASE02_PROPOSED_OPENAPI.json').read_text())
event = json.loads((root / 'PHASE02_PROPOSED_EVENT.schema.json').read_text())
assert api['openapi'].startswith('3.1.')
assert api['x-contract-status'] == 'proposed_unverified'
assert api['paths']['/api/session']['get']['operationId'] == 'proposedGetSession'
for path, entry in api['paths'].items():
    variables = set(re.findall(r'\{([^}]+)\}', path))
    declared = {api['components']['parameters'][parameter['$ref'].split('/')[-1]]['name'] for parameter in entry.get('parameters', [])}
    assert variables == declared, (path, variables, declared)
    for method, operation in entry.items():
        if method == 'parameters':
            continue
        assert method in {'get', 'post'} and operation['operationId'].startswith('proposed')
        assert operation.get('responses')
assert {'200','202','409','412','422'} <= set(api['paths']['/api/ep/v1/orgs/{orgId}/projects/{projectId}/work-items/{issueId}/transitions']['post']['responses'])
assert event['additionalProperties'] is False
assert set(event['required']) == set(event['properties'])
assert event['properties']['eventType']['enum'] == ['WorkItemUpdated', 'PermissionChanged', 'stream_reset']
print('Proposed Phase 02 contract structure: PASS (server conformance unverified)')
