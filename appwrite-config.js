// These are public browser settings. Keep the Appwrite API key in the importer environment only.
window.RIFTTRADE_APPWRITE_ENDPOINT = window.RIFTTRADE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
window.RIFTTRADE_APPWRITE_PROJECT_ID = window.RIFTTRADE_APPWRITE_PROJECT_ID || '';
window.RIFTTRADE_APPWRITE_DATABASE_ID = window.RIFTTRADE_APPWRITE_DATABASE_ID || 'rifttrade';
window.RIFTTRADE_APPWRITE_CARD_BUCKET_ID = window.RIFTTRADE_APPWRITE_CARD_BUCKET_ID || 'card-images';

if (window.Appwrite && window.RIFTTRADE_APPWRITE_PROJECT_ID) {
  const client = new window.Appwrite.Client()
    .setEndpoint(window.RIFTTRADE_APPWRITE_ENDPOINT)
    .setProject(window.RIFTTRADE_APPWRITE_PROJECT_ID);

  window.riftTradeAppwrite = {
    client,
    account: new window.Appwrite.Account(client),
    databases: new window.Appwrite.Databases(client),
    storage: new window.Appwrite.Storage(client),
  };
}