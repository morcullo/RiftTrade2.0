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
   If the project already exists, also run [`supabase-migration-card-prices.sql`](supabase-migration-card-prices.sql) to enable per-card prices, [`supabase-migration-card-foil.sql`](supabase-migration-card-foil.sql) to enable foil finishes, [`supabase-migration-buy-listings.sql`](supabase-migration-buy-listings.sql) to enable buying listings, [`supabase-migration-public-pending-listings.sql`](supabase-migration-public-pending-listings.sql) to make pending marketplace listings visible to everyone, [`supabase-migration-public-profile-listings.sql`](supabase-migration-public-profile-listings.sql) to show all member listings, including sold listings, on profiles, and [`supabase-migration-public-listing-messaging.sql`](supabase-migration-public-listing-messaging.sql) to allow sharing those listings in direct messages.
   Run [`supabase-migration-home-stats.sql`](supabase-migration-home-stats.sql) to enable the aggregate metrics on the home page.
   Run or rerun [`supabase-migration-direct-messaging.sql`](supabase-migration-direct-messaging.sql) to enable private user-to-user conversations, unread tracking, live message updates, listing cards shared in messages, and repair earlier recursive listing-sharing policies.
   Run [`supabase-migration-admin.sql`](supabase-migration-admin.sql) to promote `mdorcullo@gmail.com` when that Auth account exists and enable the protected administrator workspace. Administrators can assign each account the `user`, `moderator`, or `admin` privilege from the user editor. Moderators can view reports and user message history; only administrators can assign privileges or manage listings, cards, password resets, and user deletion. Run this migration only from the Supabase SQL Editor after applying any previous version of the migration.
3. Set the browser URL and anon key in [`supabase-config.js`](supabase-config.js). The anon key is safe in the browser when the RLS policies are enabled.
4. Import the catalog and the direct image URLs from [`riftbound_image_urls.csv`](riftbound_image_urls.csv) with a server-side service-role key:

   ```sh
   export SUPABASE_URL="https://your-project.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   python3 scripts/import_to_supabase.py
   ```

   On Windows PowerShell, use `$env:SUPABASE_URL="https://your-project.supabase.co"`, `$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"`, and `python scripts/import_to_supabase.py` instead. Rerun the import for an existing project to populate `cards.image_url` and clear the old card image filenames/paths. It does not upload images or delete existing storage objects; check that card images load before removing any old `card-images` bucket. Keep the profile image bucket for member photos. Never put the service-role key in the browser or commit it.

### Discord login

1. In the Discord Developer Portal, create an application and copy its **Client ID** and **Client Secret** from OAuth2.
2. In Supabase, open **Authentication → Sign In / Providers → Discord**, enable Discord, and enter those credentials.
3. Add this callback URL to the Discord application's OAuth2 redirect URLs: `https://rdsseyfwxfexiueegcaa.supabase.co/auth/v1/callback`.
4. In Supabase **Authentication → URL Configuration**, set the production Site URL and add the local app URL (for example, `http://127.0.0.1:3000/**`) and deployed app URL to the redirect URL allowlist.
5. Open the app's account dialog and select **Continue with Discord**.

### Profile photos

Run [`supabase-migration-profile-avatar.sql`](supabase-migration-profile-avatar.sql) in the Supabase SQL Editor to create the public profile image bucket and its owner-only upload policies. Members can then select a photo or use their device camera from their profile header; the same image appears in Inbox conversations.

Keep the Discord Client Secret in Supabase only; never add it to the browser config.

## Data model

- Supabase Auth owns users; `profiles` stores public profile fields.
- Public profile dialogs show a member's display name, avatar, membership duration, listings, and activity rank; email addresses and Discord IDs are not shown publicly.
- Apply [`supabase-migration-profile-email.sql`](supabase-migration-profile-email.sql) and [`supabase-migration-discord-profile-link.sql`](supabase-migration-discord-profile-link.sql) only when those private integrations are needed elsewhere.
- Profile ranks progress from Iron through Challenger using completed transactions and membership duration. Completed transactions include confirmed sales as either seller or buyer; completions outside RiftTrade do not count. Total listings remain visible as profile activity information, but do not affect rank qualification. Challenger requires at least 250 completed transactions and 730 days as a member.
- Run [`supabase-migration-sale-confirmations.sql`](supabase-migration-sale-confirmations.sql) after [`supabase-migration-direct-messaging.sql`](supabase-migration-direct-messaging.sql). Sellers can request confirmation from members they have messaged; the authenticated buyer must confirm in Inbox before the listing can become sold.
- `cards` contains the Riftbound catalog from `riftbound_catalog_data/cards.csv`.
- `listings` belongs to one seller and supports trade, sale, buying, or combinations of trade and sale.
- `listing_cards` links each listing to one or more cards and stores quantity, condition, language, foil finish for Common and Uncommon cards, and notes.

The Marketplace displays active Supabase listings and their linked `listing_cards` rows. Signed-in users can create selling, trading, or buying listings from the **New listing** control; buying listings use the card prices as the offer price. The **My trades** view shows every listing owned by the signed-in user, including its cards, type, price, and status. Owners can edit or delete their listings, or mark them as pending or sold from the listing details dialog; pending listings use the `paused` status and sold listings use `completed`, so neither remains in the public Marketplace. The listing owner and card relationship are protected by the SQL policies.