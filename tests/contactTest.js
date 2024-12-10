const buildDriver = require('../utils/webdriverSetup');
const LoginPage = require('../pages/loginPage');
const ContactPage = require('../pages/contactPage');
const SalesforceAPI = require('../services/salesforceAPI');
const config = require('../config/config.json');

(async () => {
    const driver = await buildDriver();

    try {
        // Step 1: Login to Salesforce
        const loginPage = new LoginPage(driver);
        await loginPage.open();
        await loginPage.login(config.username, config.password);
        console.log('Login successful.');

        // Step 2: Create a Contact using API
        const auth = await SalesforceAPI.authenticate();
        const contactData = {
            FirstName: "Jane",
            LastName: "Doe",
            AccountId: "some_account_id", // Replace with an actual Account ID
            Email: "jane.doe@example.com",
            Phone: "123-456-7890"
        };
        const newContact = await SalesforceAPI.performCRUD(auth.instanceUrl, auth.accessToken, 'Contact', 'POST', contactData);
        console.log('Contact created via API:', newContact);

        // Step 3: Verify the Contact using UI
        const contactPage = new ContactPage(driver);
        await contactPage.openContactPage(newContact.id);
        const contactName = await contactPage.getContactName();
        console.log('Contact name from UI:', contactName);

        // Step 4: Perform further UI operations (e.g., Edit, Delete)
        // Add test steps for editing or deleting the contact if needed.

    } catch (error) {
        console.error('Error in contact test:', error);
    } finally {
        await driver.quit();
    }
})();
