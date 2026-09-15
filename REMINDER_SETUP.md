# SNOO 2026 reminder email setup

The application code is ready for Resend + Vercel Cron, but production email sending requires three Vercel Production environment variables:

- `RESEND_API_KEY` - create/provision in Resend. Do not commit it.
- `SNOO_REMINDER_FROM` - for example `Avvero <evenimente@avvero.ro>`. The domain must be verified in Resend.
- `CRON_SECRET` - a random secret of at least 16 characters. Vercel automatically sends it as `Authorization: Bearer ...` to the cron endpoint.

Current provisional event configuration is in `api/_event.js`:
- 16 October 2026
- 16:00 Europe/Bucharest
- ROMEXPO, București

The cron runs daily at 07:00 UTC and the endpoint sends reminders only when the current Bucharest date is exactly one day before the configured event date.

Admin includes `Trimite reminder de test`. This asks for a test email address and does not alter participant reminder statuses.
