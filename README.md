# RiftTrade 2.0

RiftTrade is a minimal, mobile-friendly starting point for trading Riftbound cards. This version is a dependency-free static prototype with four client-side views:

- Home
- Marketplace
- My trades
- Inbox

Open `index.html` directly in a browser, or serve this folder with any static web server. The marketplace search is currently powered by the sample listings in the page.

## Appwrite setup

1. Create an Appwrite project and add your website origin under **Settings > Platforms > Web app**.
2. Create an API key with Database and Storage read/write permissions. Keep this key server-side; never put it in `appwrite-config.js`.
3. Create the database and collections described in [`appwrite-schema.json`](appwrite-schema.json). Use these IDs exactly: database `rifttrade`, bucket `card-images`, and collections `profiles`, `cards`, `listings`, `listing_cards`.
4. Configure collection permissions: `cards` should be readable by Any and writable only by the import API key. Profiles, listings, and listing cards should use document-level security for authenticated owners.
5. Add the project ID to [`appwrite-config.js`](appwrite-config.js):

	```js
	window.RIFTTRADE_APPWRITE_PROJECT_ID = 'your-project-id';
	```

6. Import the catalog and images:

	```sh
	export APPWRITE_PROJECT_ID="your-project-id"
	export APPWRITE_API_KEY="your-server-api-key"
	python3 scripts/import_to_appwrite.py
	```

	Optional variables are `APPWRITE_ENDPOINT`, `APPWRITE_DATABASE_ID`, and `APPWRITE_CARD_BUCKET_ID`.

## Data model

- Appwrite Account handles users and sessions; `profiles` stores public profile fields.
- `cards` contains the 1,189 records from `riftbound_catalog_data/cards.csv`.
- `listings` belongs to one seller and supports trade, sale, or both.
- `listing_cards` links each listing to one or more cards and stores quantity, condition, language, and notes.

The browser client is exposed as `window.riftTradeAppwrite` when a project ID is configured. The current Marketplace screen still displays sample listings; the next wiring step is querying Appwrite's `listings` and `listing_cards` collections.