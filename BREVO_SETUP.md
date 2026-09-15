# Brevo setup pentru AVVERO SNOO 2026

Variabile Vercel Production necesare:

- `BREVO_API_KEY` = cheia API Brevo
- `SNOO_BREVO_SENDER_EMAIL` = adresa reală verificată în Brevo
- `SNOO_BREVO_SENDER_NAME` = numele afișat al expeditorului, opțional. Implicit: `noreply@avvero.ro`
- `CRON_SECRET` = secretul existent pentru cron
- `SNOO_FIREBASE_ADMIN_CONFIG` = configurația Firebase existentă

După adăugarea variabilelor, fă Redeploy.

Testare din Admin:
- `Trimite confirmare de test` testează emailul imediat după înscriere.
- `Trimite reminder de test` testează emailul trimis cu o zi înainte.

Emailurile folosesc logo-ul public: https://avvero-x-snoo.vercel.app/avvero-logo-principal.png
