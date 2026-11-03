import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Maximize2,
  Minimize2,
  MousePointer2,
  Plus,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
  Scan,
  GitBranch,
} from "lucide-react";
import { uiText, type Locale } from "./i18n";
import type { AdminConfig, WorkflowTransition } from "./phase13Domain";
import {
  arrangeWorkflow,
  NODE_HEIGHT,
  NODE_WIDTH,
  readWorkflowPositions,
  routeTransition,
  transitionCaption,
  universalIncoming,
  type WorkflowPositions,
} from "./workflowCanvas";
import "./workflowDesigner.css";

type Selection =
  | { kind: "status"; id: string }
  | { kind: "transition"; id: string }
  | { kind: "group"; id: string }
  | null;
type Props = {
  config: AdminConfig;
  locale: Locale;
  scope: string;
  change?: (update: (next: AdminConfig) => void) => void;
};

export function WorkflowDesigner({ config, locale, scope, change }: Props) {
  const t = (en: string, fa: string, ar: string) => uiText(locale, en, fa, ar);
  const storageKey = `empire-workflow-layout-v1:${scope}`;
  const load = () => {
    try {
      return readWorkflowPositions(
        localStorage.getItem(storageKey),
        config.statuses,
      );
    } catch {
      return arrangeWorkflow(config.statuses);
    }
  };
  const [positions, setPositions] = useState<WorkflowPositions>(load);
  const [selection, setSelection] = useState<Selection>(null);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [connecting, setConnecting] = useState(false);
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");
  const [individual, setIndividual] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [history, setHistory] = useState<AdminConfig[]>([]);
  const [name, setName] = useState("");
  const [required, setRequired] = useState("");
  const [from, setFrom] = useState(config.statuses[0]?.id ?? "todo");
  const [to, setTo] = useState(config.statuses[1]?.id ?? "review");
  const frame = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const fullTrigger = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    id: string;
    x: number;
    y: number;
    point: { x: number; y: number };
    moved: boolean;
  } | null>(null);
  const skipNodeClick = useRef(false);
  const skipPortClick = useRef(false);
  const marker = useId().replaceAll(":", "");
  const status =
    selection?.kind === "status"
      ? config.statuses.find((s) => s.id === selection.id)
      : undefined;
  const transition =
    selection?.kind === "transition"
      ? config.transitions.find((e) => e.id === selection.id)
      : undefined;
  const groups =
    !individual && config.transitions.length > 12
      ? universalIncoming(config)
      : new Map<string, WorkflowTransition[]>();
  const groupedIds = new Set([...groups.values()].flat().map((e) => e.id));
  // Like Jira, show existing consecutive paths alongside universal shortcuts.
  // A shortcut is another representation of those same IDs, never a new action.
  const consecutive = new Set(
    config.statuses.slice(1).map((s, i) => `${config.statuses[i].id}->${s.id}`),
  );
  const visible = config.transitions.filter(
    (e) => !groupedIds.has(e.id) || consecutive.has(`${e.from}->${e.to}`) ||
      (selection?.kind === "transition" && selection.id === e.id),
  );
  const width = Math.max(
    1340,
    ...Object.values(positions).map((p) => p.x + NODE_WIDTH + 260),
    ...visible.map(
      (e, i) =>
        Math.max(positions[e.from]?.x ?? 0, positions[e.to]?.x ?? 0) +
        NODE_WIDTH +
        360 +
        i * 27,
    ),
  );
  const height = Math.max(
    760,
    ...Object.values(positions).map((p) => p.y + NODE_HEIGHT + 100),
  );
  const editable = !!change;

  useEffect(() => {
    setPositions(load());
    setSelection(null);
    setHistory([]);
    setSource("");
    setFull(false);
  }, [scope]);
  useEffect(() => {
    setPositions((current) => ({
      ...arrangeWorkflow(config.statuses),
      ...current,
    }));
  }, [config.statuses.map((s) => s.id).join("|")]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    } catch {
      /* Layout stays in this session. */
    }
  }, [positions, storageKey]);
  useEffect(() => {
    if (status) {
      setName(status.label);
      setRequired("");
    } else if (transition) {
      setName(transition.name ?? "");
      setRequired(transition.requiredFields.join(", "));
    }
  }, [
    status?.id,
    status?.label,
    transition?.id,
    transition?.name,
    transition?.requiredFields.join("|"),
  ]);
  useEffect(() => {
    if (
      (selection?.kind === "status" && !status) ||
      (selection?.kind === "transition" && !transition)
    )
      setSelection(null);
  }, [config, selection]);
  useEffect(() => {
    if (!editable) {
      setConnecting(false);
      setSource("");
    }
  }, [editable]);
  useEffect(() => {
    if (!full) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFull(false);
      }
      if (event.key === "Tab") {
        const items = [
          ...(dialog.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]',
          ) ?? []),
        ].filter((e) => e.getClientRects().length);
        const first = items[0],
          last = items.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      requestAnimationFrame(() => {
        fullTrigger.current?.focus();
      });
    };
  }, [full]);
  const mutate = (update: (next: AdminConfig) => void) => {
    if (!change) return;
    setHistory((prior) => [...prior.slice(-19), structuredClone(config)]);
    change(update);
    setMessage(
      t(
        "Unsaved workflow edit. Save a draft revision to persist it.",
        "تغییر ذخیره‌نشده؛ برای ثبت، نسخهٔ پیش‌نویس را ذخیره کنید.",
        "تعديل غير محفوظ. احفظ إصدار المسودة.",
      ),
    );
  };
  const choose = (id: string) => {
    if (skipNodeClick.current) {
      skipNodeClick.current = false;
      return;
    }
    if (!connecting) {
      setSelection({ kind: "status", id });
      return;
    }
    if (!source) {
      setSource(id);
      setMessage(
        t(
          "Choose the destination status.",
          "وضعیت مقصد را انتخاب کنید.",
          "اختر الحالة الوجهة.",
        ),
      );
      return;
    }
    addTransition(source, id);
  };
  const addTransition = (a: string, b: string) => {
    if (!editable) return;
    if (a === b) {
      setMessage(
        t(
          "Choose a different destination.",
          "مقصد دیگری انتخاب کنید.",
          "اختر وجهة مختلفة.",
        ),
      );
      return;
    }
    const existing = config.transitions.find((e) => e.from === a && e.to === b);
    if (existing) {
      setSelection({ kind: "transition", id: existing.id });
      setMessage(
        t(
          "Existing transition selected; nothing was removed.",
          "انتقال موجود انتخاب شد؛ هیچ اتصالی حذف نشد.",
          "حُدد الانتقال الموجود؛ لم يُحذف شيء.",
        ),
      );
    } else {
      const id = `transition-${crypto.randomUUID()}`;
      mutate((next) =>
        next.transitions.push({
          id,
          from: a as WorkflowTransition["from"],
          to: b as WorkflowTransition["to"],
          requiredFields: [],
        }),
      );
      setSelection({ kind: "transition", id });
    }
    setSource("");
    setConnecting(false);
  };
  const down = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (connecting || event.button !== 0) return;
    drag.current = {
      id,
      x: event.clientX,
      y: event.clientY,
      point: positions[id],
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = (event.clientX - d.x) / zoom,
      dy = (event.clientY - d.y) / zoom;
    if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
    if (d.moved)
      setPositions((current) => ({
        ...current,
        [d.id]: {
          x: Math.max(36, d.point.x + dx),
          y: Math.max(55, d.point.y + dy),
        },
      }));
  };
  const selectTransition = (e: WorkflowTransition) =>
    setSelection({ kind: "transition", id: e.id });
  const body = (
    <section
      className={`wfd${full ? " wfd-full" : ""}`}
      aria-label={t("Workflow designer", "طراح گردش‌کار", "مصمم سير العمل")}
    >
      <header className="wfd-header">
        <div>
          <div className="wfd-eyebrow">
            {t(
              "PROJECT SETTINGS / WORKFLOW",
              "تنظیمات پروژه / گردش‌کار",
              "إعدادات المشروع / سير العمل",
            )}
          </div>
          <h2>{t("Project workflow", "گردش‌کار پروژه", "سير عمل المشروع")}</h2>
          <span>
            {config.statuses.length} {t("statuses", "وضعیت", "حالات")} ·{" "}
            <b data-testid="workflow-transition-count">
              {config.transitions.length}
            </b>{" "}
            {t("transitions", "انتقال", "انتقالات")} ·{" "}
            {editable
              ? t("Unsaved Demo draft", "پیش‌نویس نمونه", "مسودة تجريبية")
              : t("Read-only", "فقط خواندنی", "للقراءة فقط")}
          </span>
        </div>
        <div className="wfd-header-actions">
          <button
            disabled={!history.length || !editable}
            onClick={() => {
              const last = history.at(-1);
              if (last && change) {
                change((next) => {
                  next.statuses = structuredClone(last.statuses);
                  next.transitions = structuredClone(last.transitions);
                });
                setHistory((h) => h.slice(0, -1));
                setSelection(null);
              }
            }}
          >
            <Undo2 size={16} />
            {t("Undo edit", "واگرد ویرایش", "تراجع")}
          </button>
          <button
            ref={!full ? fullTrigger : undefined}
            onClick={() => setFull((v) => !v)}
          >
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{" "}
            {full
              ? t("Close large view", "بستن نمای بزرگ", "إغلاق العرض الكبير")
              : t("Large view", "نمای بزرگ", "عرض كبير")}
          </button>
        </div>
      </header>
      <div className="wfd-toolbar">
        <div>
          <button
            aria-pressed={!connecting}
            onClick={() => {
              setConnecting(false);
              setSource("");
            }}
          >
            <MousePointer2 size={15} />
            {t("Select / move", "انتخاب / جابه‌جایی", "تحديد / نقل")}
          </button>
          <button
            aria-pressed={connecting}
            disabled={!editable}
            onClick={() => {
              setConnecting((v) => !v);
              setSource("");
            }}
          >
            <GitBranch size={16} />
            {t("Add transition", "افزودن انتقال", "إضافة انتقال")}
          </button>
          <button
            onClick={() => {
              setPositions(arrangeWorkflow(config.statuses));
              setMessage(
                t(
                  "Layout arranged. All original transitions and rules are unchanged.",
                  "چیدمان مرتب شد؛ تمام انتقال‌ها و قواعد قبلی حفظ شدند.",
                  "رُتب التخطيط؛ لم تتغير الانتقالات والقواعد.",
                ),
              );
            }}
          >
            {t("Arrange layout", "مرتب‌سازی چیدمان", "ترتيب التخطيط")}
          </button>
        </div>
        <div>
          <button
            aria-label={t("Zoom out", "کوچک‌نمایی", "تصغير")}
            disabled={zoom <= 0.65}
            onClick={() => setZoom((z) => Math.max(0.65, z - 0.1))}
          >
            <ZoomOut size={16} />
          </button>
          <span className="wfd-zoom">{Math.round(zoom * 100)}%</span>
          <button
            aria-label={t("Zoom in", "بزرگ‌نمایی", "تكبير")}
            disabled={zoom >= 1.6}
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              frame.current?.scrollTo({ left: 0, top: 0 });
            }}
          >
            <Scan size={16} />
            {t("Readable size", "اندازهٔ خوانا", "حجم مقروء")}
          </button>
        </div>
      </div>
      <div className="wfd-workarea">
        <div
          className="wfd-viewport"
          ref={frame}
          tabIndex={0}
          aria-label={t(
            "Workflow canvas. Scroll to pan.",
            "بوم گردش‌کار؛ برای حرکت پیمایش کنید.",
            "لوحة سير العمل؛ مرر للتنقل.",
          )}
        >
          <div
            style={{ width: width * zoom, height: height * zoom }}
            className="wfd-scroll-space"
          >
            <div
              className="wfd-canvas"
              style={{ width, height, transform: `scale(${zoom})` }}
              dir="ltr"
            >
              <svg
                width={width}
                height={height}
                className="wfd-edges"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id={marker}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L10 5 L0 10Z" fill="context-stroke" />
                  </marker>
                </defs>
                {visible.map((e, i) => {
                  const a = positions[e.from],
                    b = positions[e.to];
                  if (!a || !b) return null;
                  const route = routeTransition(a, b, i);
                  const active =
                    selection?.kind === "transition"
                      ? selection.id === e.id
                      : selection?.kind === "status" &&
                        (e.from === selection.id || e.to === selection.id);
                  return (
                    <g
                      key={e.id}
                      className={active ? "wfd-path selected" : "wfd-path"}
                    >
                      <title>{transitionCaption(e, config.statuses)}</title>
                      <path d={route.path} markerEnd={`url(#${marker})`} />
                      <path
                        className="wfd-hit"
                        d={route.path}
                        onPointerEnter={() => setHovered(e.id)}
                        onPointerLeave={() => setHovered(null)}
                        onClick={() => selectTransition(e)}
                      />
                    </g>
                  );
                })}
                {[...groups].map(([id]) => {
                  const p = positions[id];
                  return p ? (
                    <path
                      key={id}
                      className="wfd-global-path"
                      d={`M ${p.x + NODE_WIDTH + 108} ${p.y + 24} H ${p.x + NODE_WIDTH + 4}`}
                      markerEnd={`url(#${marker})`}
                    />
                  ) : null;
                })}
              </svg>
              {visible.map((e, i) => {
                const a = positions[e.from],
                  b = positions[e.to];
                if (!a || !b) return null;
                const route = routeTransition(a, b, i);
                const active =
                  selection?.kind === "transition" && selection.id === e.id;
                return (
                  <button
                    key={e.id}
                    className={`wfd-edge-label${active ? " selected" : ""}${visible.length > 12 && !active && hovered !== e.id ? " wfd-quiet-label" : ""}`}
                    data-transition-id={e.id}
                    style={{ left: route.label.x, top: route.label.y }}
                    onClick={() => selectTransition(e)}
                    aria-label={transitionCaption(e, config.statuses)}
                  >
                    {transitionCaption(e, config.statuses)}
                  </button>
                );
              })}
              {[...groups].map(([id, items]) => {
                const p = positions[id];
                return p ? (
                  <button
                    key={id}
                    className="wfd-all"
                    style={{ left: p.x + NODE_WIDTH + 114, top: p.y + 12 }}
                    onClick={() => setSelection({ kind: "group", id })}
                    aria-label={`${t("All statuses to", "همهٔ وضعیت‌ها به", "كل الحالات إلى")} ${config.statuses.find((s) => s.id === id)?.label}`}
                  >
                    {t("All", "همه", "الكل")} <span>{items.length}</span>
                  </button>
                ) : null;
              })}
              {config.statuses.map((item) => {
                const p = positions[item.id];
                if (!p) return null;
                return (
                  <div
                    className={`wfd-node-wrap wfd-category-${item.id}`}
                    key={item.id}
                    style={{
                      left: p.x,
                      top: p.y,
                      width: NODE_WIDTH,
                      height: NODE_HEIGHT,
                    }}
                  >
                    <button
                      className={`wfd-node${(selection?.kind === "status" && selection.id === item.id) || source === item.id ? " selected" : ""}`}
                      onPointerDown={(e) => down(e, item.id)}
                      data-status-id={item.id}
                      onPointerMove={move}
                      onPointerUp={() => {
                        skipNodeClick.current = !!drag.current?.moved;
                        drag.current = null;
                      }}
                      onPointerCancel={() => {
                        drag.current = null;
                      }}
                      onClick={() => choose(item.id)}
                      onKeyDown={(e) => {
                        if (
                          e.altKey &&
                          [
                            "ArrowLeft",
                            "ArrowRight",
                            "ArrowUp",
                            "ArrowDown",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                          const dx =
                              e.key === "ArrowLeft"
                                ? -20
                                : e.key === "ArrowRight"
                                  ? 20
                                  : 0,
                            dy =
                              e.key === "ArrowUp"
                                ? -20
                                : e.key === "ArrowDown"
                                  ? 20
                                  : 0;
                          setPositions((all) => ({
                            ...all,
                            [item.id]: {
                              x: Math.max(36, p.x + dx),
                              y: Math.max(55, p.y + dy),
                            },
                          }));
                        }
                      }}
                      aria-label={`${t("Status", "وضعیت", "حالة")}: ${item.label}`}
                    >
                      <bdi>{item.label}</bdi>
                    </button>
                    {editable && (
                      <button
                        className="wfd-port"
                        aria-label={`${t("Connect from", "اتصال از", "اتصل من")} ${item.label}`}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          e.currentTarget.setPointerCapture(e.pointerId);
                          setConnecting(true);
                          setSource(item.id);
                        }}
                        onPointerUp={(e) => {
                          const target = document
                            .elementFromPoint(e.clientX, e.clientY)
                            ?.closest("[data-status-id]")
                            ?.getAttribute("data-status-id");
                          if (target && target !== item.id) {
                            skipPortClick.current = true;
                            addTransition(item.id, target);
                          }
                        }}
                        onClick={() => {
                          if (skipPortClick.current) {
                            skipPortClick.current = false;
                            return;
                          }
                          setConnecting(true);
                          setSource(item.id);
                          setMessage(
                            t(
                              "Select a destination or drag the handle to it.",
                              "مقصد را انتخاب کنید یا دستگیره را تا آن بکشید.",
                              "اختر وجهة أو اسحب المقبض إليها.",
                            ),
                          );
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    )}
                    <span
                      data-status-id={item.id}
                      className="wfd-drop-zone"
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {selection && (
          <aside
            className="wfd-inspector"
            aria-label={t(
              "Selected element settings",
              "تنظیمات عنصر انتخاب‌شده",
              "إعدادات العنصر المحدد",
            )}
          >
            <div className="wfd-inspector-top">
              <strong>
                {status
                  ? t("Status", "وضعیت", "الحالة")
                  : transition
                    ? t("Transition", "انتقال", "الانتقال")
                    : t(
                        "Incoming transitions",
                        "انتقال‌های ورودی",
                        "الانتقالات الواردة",
                      )}
              </strong>
              <button
                onClick={() => setSelection(null)}
                aria-label={t(
                  "Close properties",
                  "بستن تنظیمات",
                  "إغلاق الخصائص",
                )}
              >
                <X size={17} />
              </button>
            </div>
            {status && (
              <>
                <code>{status.id}</code>
                <label>
                  {t("Status name", "نام وضعیت", "اسم الحالة")}
                  <input
                    value={name}
                    disabled={!editable}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <button
                  disabled={!editable || !name.trim()}
                  onClick={() =>
                    mutate((next) => {
                      const s = next.statuses.find((s) => s.id === status.id);
                      if (s) s.label = name.trim();
                    })
                  }
                >
                  <Check size={15} />
                  {t("Apply to draft", "اعمال در پیش‌نویس", "تطبيق في المسودة")}
                </button>
                <h3>
                  {t(
                    "Connected transitions",
                    "انتقال‌های مرتبط",
                    "الانتقالات المتصلة",
                  )}
                </h3>
              </>
            )}
            {transition && (
              <>
                <p className="wfd-direction">
                  <bdi>{transition.from}</bdi>
                  <ArrowRight size={16} />
                  <bdi>{transition.to}</bdi>
                </p>
                <label>
                  {t("Action name", "نام اقدام", "اسم الإجراء")}
                  <input
                    value={name}
                    disabled={!editable}
                    placeholder={transitionCaption(transition, config.statuses)}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  {t(
                    "Required field keys",
                    "کلید فیلدهای الزامی",
                    "مفاتيح الحقول المطلوبة",
                  )}
                  <input
                    value={required}
                    disabled={!editable}
                    onChange={(e) => setRequired(e.target.value)}
                  />
                </label>
                <button
                  disabled={!editable}
                  onClick={() =>
                    mutate((next) => {
                      const edge = next.transitions.find(
                        (e) => e.id === transition.id,
                      );
                      if (edge) {
                        edge.name = name.trim() || undefined;
                        edge.requiredFields = required
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                      }
                    })
                  }
                >
                  <Check size={15} />
                  {t("Apply to draft", "اعمال در پیش‌نویس", "تطبيق في المسودة")}
                </button>
                <p className="wfd-disclosure">
                  {t(
                    "Server authorization rules are not configured by this Demo editor.",
                    "این ویرایشگر نمونه، قواعد مجوز سرور را تنظیم نمی‌کند.",
                    "لا يضبط هذا المحرر التجريبي صلاحيات الخادم.",
                  )}
                </p>
                <details>
                  <summary>
                    {t(
                      "Remove this transition",
                      "حذف این انتقال",
                      "حذف هذا الانتقال",
                    )}
                  </summary>
                  <p>
                    {t(
                      "Only this action will be removed from the unsaved draft.",
                      "فقط این اقدام از پیش‌نویس ذخیره‌نشده حذف می‌شود.",
                      "يُحذف هذا الإجراء فقط من المسودة غير المحفوظة.",
                    )}
                  </p>
                  <button
                    disabled={!editable}
                    onClick={() => {
                      mutate((next) => {
                        next.transitions = next.transitions.filter(
                          (e) => e.id !== transition.id,
                        );
                      });
                      setSelection(null);
                    }}
                  >
                    {t("Confirm removal", "تأیید حذف", "تأكيد الحذف")}
                  </button>
                </details>
              </>
            )}
            {(status || selection.kind === "group") && (
              <div className="wfd-transition-list">
                {config.transitions
                  .filter((e) =>
                    status
                      ? e.from === status.id || e.to === status.id
                      : e.to === selection.id,
                  )
                  .map((e) => (
                    <button key={e.id} onClick={() => selectTransition(e)}>
                      <bdi>{transitionCaption(e, config.statuses)}</bdi>
                      <small>
                        <bdi>
                          {e.from} → {e.to}
                        </bdi>
                      </small>
                    </button>
                  ))}
              </div>
            )}
          </aside>
        )}
      </div>
      <div className="wfd-bottom">
        <span role="status">
          {message ||
            (connecting
              ? source
                ? t("Choose destination", "مقصد را انتخاب کنید", "اختر الوجهة")
                : t("Choose source", "مبدأ را انتخاب کنید", "اختر المصدر")
              : t(
                  "Drag statuses to move. Select a named connection to edit it.",
                  "وضعیت‌ها را جابه‌جا کنید؛ برای ویرایش انتقال، نام آن را انتخاب کنید.",
                  "اسحب الحالات لنقلها وحدد اسم الانتقال لتحريره.",
                ))}
        </span>
        <button onClick={() => setIndividual((v) => !v)}>
          {individual
            ? t(
                "Group equivalent incoming paths",
                "گروه‌بندی ورودی‌های هم‌قاعده",
                "تجميع المسارات المتكافئة",
              )
            : t(
                "Show every individual transition",
                "نمایش تک‌تک انتقال‌ها",
                "عرض كل انتقال منفرد",
              )}
          <ChevronDown size={13} />
        </button>
      </div>
      {editable && (
        <details className="wfd-connection-form">
          <summary>
            {t(
              "Connect using a form · keyboard / mobile",
              "ساخت اتصال با فرم · کیبورد / موبایل",
              "اتصال بنموذج · لوحة المفاتيح / الجوال",
            )}
          </summary>
          <div>
            <label>
              {t("Source status", "وضعیت مبدأ", "الحالة المصدر")}
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as typeof from)}
              >
                {config.statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <ArrowRight size={17} />
            <label>
              {t("Destination status", "وضعیت مقصد", "الحالة الوجهة")}
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as typeof to)}
              >
                {config.statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => addTransition(from, to)}>
              {t("Create transition", "ساخت انتقال", "إنشاء انتقال")}
            </button>
          </div>
        </details>
      )}
    </section>
  );
  return full
    ? createPortal(
        <div
          className="wfd-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={t(
            "Large workflow designer",
            "طراح گردش‌کار بزرگ",
            "مصمم سير العمل الكبير",
          )}
          ref={dialog}
          tabIndex={-1}
        >
          {body}
        </div>,
        document.body,
      )
    : body;
}
