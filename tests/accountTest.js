const buildDriver = require('../utils/webdriverSetup');
const LoginPage = require('../pages/loginPage');
const AccountPage = require('../pages/accountPage');
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

        // Step 2: Create an Account using API
        const auth = await SalesforceAPI.authenticate();
        const accountData = {
            Name: "Acme Corporation",
            Phone: "987-654-3210",
            Website: "http://www.acme.com"
        };
        const newAccount = await SalesforceAPI.performCRUD(auth.instanceUrl, auth.accessToken, 'Account', 'POST', accountData);
        console.log('Account created via API:', newAccount);

        // Step 3: Verify the Account using UI
        const accountPage = new AccountPage(driver);
        await accountPage.openAccountPage(newAccount.id);
        const accountName = await accountPage.getAccountName();
        console.log('Account name from UI:', accountName);

        // Step 4: Perform further UI operations (e.g., Edit, Delete)
        // Add test steps for editing or deleting the account if needed.

    } catch (error) {
        console.error('Error in account test:', error);
    } finally {
        await driver.quit();
    }
})();
