# FinanceHub – Updated UI

This version keeps the existing FinanceHub/Supabase functionality and updates only the requested UI behavior:

- Fixed-height transaction and loan tables with internal vertical scrolling.
- Sticky table headers and horizontal scrolling when columns are wider than the screen.
- Compact profile/greeting card on desktop and mobile (the card no longer stretches down the page).
- Wallet/account cards redesigned to match the compact top-card style, including balance visibility control.
- Logout confirmation: “Are you sure you want to log out?” with Somali/English wording.
- Password visibility eye on login and password-update fields.
- Improved light/dark theme consistency for cards, tables, inputs, text, and surfaces.
- English/Somali UI translations extended across the main interface and dynamic loan/report messages.
- Existing Supabase URL/anon-key configuration and database functionality are preserved.

## Run

Open `index.html` through a local/static web server. Keep the existing Supabase project and credentials unchanged.

Do not expose a Supabase `service_role` key in frontend code.
