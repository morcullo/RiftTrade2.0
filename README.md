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
   If the project already exists, also run [`supabase-migration-card-prices.sql`](supabase-migration-card-prices.sql) to enable per-card prices, [`supabase-migration-card-foil.sql`](supabase-migration-card-foil.sql) to enable foil finishes, and [`supabase-migration-buy-listings.sql`](supabase-migration-buy-listings.sql) to enable buying listings.
   Run [`supabase-migration-home-stats.sql`](supabase-migration-home-stats.sql) to enable the aggregate metrics on the home page.
3. Set the browser URL and anon key in [`supabase-config.js`](supabase-config.js). The anon key is safe in the browser when the RLS policies are enabled.
4. Import the catalog and images with a server-side service-role key:

   ```sh
   export SUPABASE_URL="https://your-project.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   python3 scripts/import_to_supabase.py
   ```

   Never put the service-role key in the browser or commit it.

### Discord login

1. In the Discord Developer Portal, create an application and copy its **Client ID** and **Client Secret** from OAuth2.
2. In Supabase, open **Authentication → Sign In / Providers → Discord**, enable Discord, and enter those credentials.
3. Add this callback URL to the Discord application's OAuth2 redirect URLs: `https://rdsseyfwxfexiueegcaa.supabase.co/auth/v1/callback`.
4. In Supabase **Authentication → URL Configuration**, set the production Site URL and add the local app URL (for example, `http://127.0.0.1:3000/**`) and deployed app URL to the redirect URL allowlist.
5. Open the app's account dialog and select **Continue with Discord**.

Keep the Discord Client Secret in Supabase only; never add it to the browser config.

## Data model

- Supabase Auth owns users; `profiles` stores public profile fields.
- Public profile dialogs show account email addresses to all visitors; apply [`supabase-migration-profile-email.sql`](supabase-migration-profile-email.sql) to backfill emails and keep them synced.
- Apply [`supabase-migration-discord-profile-link.sql`](supabase-migration-discord-profile-link.sql) to backfill Discord IDs and show contact links for members who connected Discord.
- `cards` contains the Riftbound catalog from `riftbound_catalog_data/cards.csv`.
- `listings` belongs to one seller and supports trade, sale, buying, or combinations of trade and sale.
- `listing_cards` links each listing to one or more cards and stores quantity, condition, language, foil finish for Common and Uncommon cards, and notes.

The Marketplace displays active Supabase listings and their linked `listing_cards` rows. Signed-in users can create selling, trading, or buying listings from the **New listing** control; buying listings use the card prices as the offer price. The **My trades** view shows every listing owned by the signed-in user, including its cards, type, price, and status. Owners can edit or delete their listings, or mark them as pending or sold from the listing details dialog; pending listings use the `paused` status and sold listings use `completed`, so neither remains in the public Marketplace. The listing owner and card relationship are protected by the SQL policies.