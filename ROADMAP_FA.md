# نقشه تکمیل کل UI — یک فاز در هر اجرا

فاز 00 پیش‌نیاز برآورد و تغییرات است. همه فازها برنامه دارند، نه وضعیت انجام‌شده.
تکمیل UI در Demo، صحت قرارداد، اتصال Live و تأیید کاربر چهار نتیجه مستقل‌اند.
نبود اطلاعات Engine فازهای رابط را متوقف نمی‌کند؛ gate اتصال واقعی را باز نمی‌کند.

| فاز | تحویل | نگاشت سند |
|---|---|---|
| 00 | [Repository audit and executable baseline](phases/00_REPOSITORY_AUDIT.md) | U0 |
| 01 | [Consolidate design system, shell and project switching](phases/01_CONSOLIDATE_DESIGN_SYSTEM_SHELL_AND_PROJECT_SWITCHING.md) | U1 |
| 02 | [Typed API seam and core vertical slice](phases/02_TYPED_API_SEAM_AND_CORE_VERTICAL_SLICE.md) | U0/U2 |
| 03 | [Complete WorkItem, List, forms and scoped search](phases/03_COMPLETE_WORKITEM_LIST_FORMS_AND_SCOPED_SEARCH.md) | U3 |
| 04 | [Board, Kanban behavior and dependency Work Flow](phases/04_BOARD_KANBAN_BEHAVIOR_AND_DEPENDENCY_WORK_FLOW.md) | U3 |
| 05 | [Calendar, scheduling adapter and Timeline](phases/05_CALENDAR_SCHEDULING_ADAPTER_AND_TIMELINE.md) | U3 |
| 06 | [Backlog, Sprint and capacity planning](phases/06_BACKLOG_SPRINT_AND_CAPACITY_PLANNING.md) | U3 |
| 07 | [Contextual AI, Prompt-to-View and real Voice-to-Form](phases/07_CONTEXTUAL_AI_PROMPT_TO_VIEW_AND_REAL_VOICE_TO_FORM.md) | U4 |
| 08 | [File transport, DataCart and import recovery](phases/08_FILE_TRANSPORT_DATACART_AND_IMPORT_RECOVERY.md) | U4 |
| 09 | [Intake, plan DAG and human approval](phases/09_INTAKE_PLAN_DAG_AND_HUMAN_APPROVAL.md) | U5 |
| 10 | [Agent readiness, Runs and independent Reviews](phases/10_AGENT_READINESS_RUNS_AND_INDEPENDENT_REVIEWS.md) | U5 |
| 11 | [Gallery, Knowledge, citations and source lineage](phases/11_GALLERY_KNOWLEDGE_CITATIONS_AND_SOURCE_LINEAGE.md) | U5 |
| 12 | [Overview, evidence-based Reports and Releases](phases/12_OVERVIEW_EVIDENCE_BASED_REPORTS_AND_RELEASES.md) | U5 |
| 13 | [People, organization administration and versioned Settings](phases/13_PEOPLE_ORGANIZATION_ADMINISTRATION_AND_VERSIONED_SETTINGS.md) | U5/U6 |
| 14 | [Cross-project My Work, Inbox, search and activity](phases/14_CROSS_PROJECT_MY_WORK_INBOX_SEARCH_AND_ACTIVITY.md) | U5/U6 |
| 15 | [Live reconciliation, hardening and final UI acceptance](phases/15_LIVE_RECONCILIATION_HARDENING_AND_FINAL_UI_ACCEPTANCE.md) | U6 |

## ترتیب و کنترل دامنه
فازهای 01–06 پایه قابل استفاده روزمره را کامل می‌کنند؛ 07–11 مسیر AI و تحویل Agent؛
12–14 گزارش/تنظیمات/سطح سازمان؛ 15 اثبات اتصال و پذیرش نهایی را جمع می‌کند.
زیرساخت مشترک auth، query، command، receipt و design system از ابتدا مشترک است؛
ساخت جزیره‌ای هر محصول یا چند نسخه جداگانه از یک TaskStore مجاز نیست.

هر فاز پس از اجرای تست و ارائه خروجی در awaiting_ui_ux_review متوقف می‌شود.
شروع فاز بعد فقط پس از تأیید صریح هر دو بخش UI و UX توسط کاربر مجاز است؛ یک پیام
روشن مثل «UI و UX فاز 03 تأیید است؛ فاز 04 را شروع کن» برای این دو تأیید کافی است.
صرف «ادامه» بدون تأیید، مجوز عبور از این gate نیست.
برای ظاهر یا مسیر حساس بازخورد داده شود، همان فاز اصلاح می‌شود.

فاز 02 یک برش کامل اتصال را می‌سازد؛ فاز 15 تنها محل فکرکردن به API نیست.
هر فاز بعدی adapter و contract fixtures خودش را همراه UI کامل می‌کند.
سورس موتور، OpenAPI یا provider غایب با API فرضی جایگزین و Live معرفی نمی‌شود.

## محدوده پایان
تمام routeها و قابلیت‌های قرارداد باید در ماتریس پوشش تعیین تکلیف شوند.
Memory Galaxy/Obsidian، ScheduleBlock ساعتی، Omnichannel و محاسبات پیشرفته
PMBOK/EVM اگر API ندارند به‌عنوان extension gap ثبت می‌شوند؛ نه completed.
اتصال به Production، ساخت microserviceهای Go و نصب EKS در این بسته نیست.
