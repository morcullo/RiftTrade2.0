# RiftTrade 2.0

RiftTrade is a minimal, mobile-friendly starting point for trading Riftbound cards. This version is a dependency-free static prototype with four client-side views:

- Home
- Marketplace
- My trades
- Inbox

Open `index.html` directly in a browser, or serve this folder with any static web server. The marketplace search is currently powered by the sample listings in the page.

## Supabase setup

1. Create a Supabase project and enable Email or OAuth providers under Authentication.
2. Run [`supabase-schema.sql`](supabase-schema.sql) in the Supabase SQL Editor.
   If the project already exists, also run [`supabase-migration-card-prices.sql`](supabase-migration-card-prices.sql) to enable per-card prices and [`supabase-migration-card-foil.sql`](supabase-migration-card-foil.sql) to enable foil finishes.
   Run [`supabase-migration-home-stats.sql`](supabase-migration-home-stats.sql) to enable the aggregate metrics on the home page.
3. Set the browser URL and anon key in [`supabase-config.js`](supabase-config.js). The anon key is safe in the browser when the RLS policies are enabled.
4. Import the catalog and images with a server-side service-role key:

   ```sh
   export SUPABASE_URL="https://your-project.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   python3 scripts/import_to_supabase.py
   ```

   Never put the service-role key in the browser or commit it.

## Data model

- Supabase Auth owns users; `profiles` stores public profile fields.
- `cards` contains the Riftbound catalog from `riftbound_catalog_data/cards.csv`.
- `listings` belongs to one seller and supports trade, sale, or both.
- `listing_cards` links each listing to one or more cards and stores quantity, condition, language, foil finish for Common and Uncommon cards, and notes.

The Marketplace displays active Supabase listings and their linked `listing_cards` rows. Signed-in users can create listings from the **List a card** control. The **My trades** view shows every listing owned by the signed-in user, including its cards, type, price, and status. Owners can edit or delete their listings, or mark them as pending or sold from the listing details dialog; pending listings use the `paused` status and sold listings use `completed`, so neither remains in the public Marketplace. The listing owner and card relationship are protected by the SQL policies.