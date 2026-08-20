let SibApiV3Sdk = null;
let transactionalEmailApi = null;

try {
  SibApiV3Sdk = require("sib-api-v3-sdk");

  if (process.env.BREVO_API_KEY) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  }
} catch (err) {
  console.warn("⚠️ Brevo SDK (sib-api-v3-sdk) not installed. Email sending will run in mock mode.");
}

module.exports = { transactionalEmailApi, SibApiV3Sdk };