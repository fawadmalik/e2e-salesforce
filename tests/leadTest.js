const buildDriver = require('../utils/webdriverSetup');
const LoginPage = require('../pages/loginPage');
const LeadPage = require('../pages/leadPage');
const SalesforceAPI = require('../services/salesforceAPI');
const config = require('../config/config.json');

(async () => {
    const driver = await buildDriver();

    try {
        // Login to Salesforce
        const loginPage = new LoginPage(driver);
        await loginPage.open();
        await loginPage.login(config.username, config.password);

        // Use API to create lead
        const auth = await SalesforceAPI.authenticate();
        const leadData = {
            FirstName: "John",
            LastName: "Doe",
            Company: "Example Inc"
        };
        const newLead = await SalesforceAPI.performCRUD(auth.instanceUrl, auth.accessToken, 'Lead', 'POST', leadData);
        console.log('Lead created:', newLead);

        // Verify UI operations
        const leadPage = new LeadPage(driver);
        await leadPage.openLeadPage(newLead.id);

    } catch (error) {
        console.error('Error in lead test:', error);
    } finally {
        await driver.quit();
    }
})();