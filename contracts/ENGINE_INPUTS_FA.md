# اطلاعات اتصال — ابتدا از repo پیدا شود

نبود این اطلاعات مانع ادامه UI و fixture قراردادی نیست. هیچ secret در فایل قرار ندهید.

| ورودی | محل ثبت پس از بررسی | اثر نبود |
|---|---|---|
| Frontend/Backend repo + branch و دستور اجرا | audit | بدون سورس، وضعیت نمونه‌های قبلی تأیید نمی‌شود |
| OpenAPI/event schemas و responseهای غیرحساس | ENGINE_MAPPING.csv | APIها پیشنهادی می‌مانند |
| dev/staging URL و شبکه | audit/config example | Live اتصال ندارد |
| session/SSO/CSRF topology و نقش‌های تست | ADR + test setup | auth و revoke واقعی اثبات نمی‌شود |
| ETag/idempotency/operations و receipt | mapping | retry/conflict واقعی اثبات نمی‌شود |
| SSE replay/watermark/limits | mapping | realtime واقعی اثبات نمی‌شود |
| Upload scan/ticket/preview policy | mapping | فایل و import واقعی مسدود |
| AI/speech/Agent APIs و capabilities | mapping | قابلیت مربوط unavailable؛ Demo مجزا |
| schedules و deadline contract | CD-03 ADR | زمان‌بندی ساعتی Live غیرفعال |
| schema/workflow/calendar و test data | fixtures + mapping | تنها نمونه واضح قراردادی |
| review/delivery policy و artifact formats | mapping | Accepted/Shipped واقعی ناممکن |

دسترسی تست از کانال امن/محیط انجام شود؛ password، token و secret در چت یا Markdown درخواست نشود.
