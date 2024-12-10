"# e2e-salesforce" 

An implementation of an extendable **Salesforce Testing Automation Framework** that supports end-to-end testing with separated concerns, modular design, and a Page Object Model (POM) approach.

### Framework Structure
```
/salesforce-automation-framework
  /config
    config.json          # Configuration details
  /pages
    loginPage.js         # POM for login functionality
    leadPage.js          # POM for lead operations
    contactPage.js       # POM for contact operations
    accountPage.js       # POM for account operations
  /services
    salesforceAPI.js     # OAuth and CRUD operations for Salesforce REST API
  /tests
    loginTest.js         # Test cases for login
    leadTest.js          # Test cases for lead operations
    contactTest.js       # Test cases for contact operations
    accountTest.js       # Test cases for account operations
  /utils
    webdriverSetup.js    # WebDriver configuration
    helpers.js           # Reusable helper functions
```

---

### Key Components

#### 1. **Configuration**
**`config.json`**
```json
{
  "baseUrl": "https://login.salesforce.com",
  "username": "fmcoderteacher@starqhub.com",
  "password": "PA$$word1_",
  "oauth": {
    "client_id": "your_client_id_here",
    "client_secret": "your_client_secret_here",
    "grant_type": "password"
  }
}
```

---

#### 2. **Page Object Models**
**`loginPage.js`**
```javascript
const { By } = require('selenium-webdriver');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://login.salesforce.com";
    }

    async open() {
        await this.driver.get(this.url);
    }

    async login(username, password) {
        await this.driver.findElement(By.id('username')).sendKeys(username);
        await this.driver.findElement(By.id('password')).sendKeys(password);
        await this.driver.findElement(By.id('Login')).click();
    }
}

module.exports = LoginPage;
```

**`leadPage.js`**
```javascript
const { By } = require('selenium-webdriver');

class LeadPage {
    constructor(driver) {
        this.driver = driver;
    }

    async openLeadPage(leadId) {
        const url = `/lightning/r/Lead/${leadId}/view`;
        await this.driver.get(url);
    }

    async createLead(leadData) {
        // Fill out form and save
    }

    async deleteLead(leadId) {
        // Navigate and delete lead logic
    }
}

module.exports = LeadPage;
```

### `contactPage.js`
```javascript
const { By } = require('selenium-webdriver');

class ContactPage {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Open a specific contact page by ID
     * @param {string} contactId - The Salesforce Contact ID
     */
    async openContactPage(contactId) {
        const url = `/lightning/r/Contact/${contactId}/view`;
        await this.driver.get(url);
    }

    /**
     * Get the contact's details (example: Contact Name)
     * @returns {Promise<string>} - Contact Name
     */
    async getContactName() {
        const nameElement = await this.driver.findElement(By.css('.entityNameTitle'));
        return await nameElement.getText();
    }

    /**
     * Create a new contact
     * @param {Object} contactData - Contact data (fields and values)
     */
    async createContact(contactData) {
        await this.driver.findElement(By.xpath('//button[text()="New"]')).click();

        // Wait for the form to appear and fill it in
        await this.driver.findElement(By.name('FirstName')).sendKeys(contactData.FirstName);
        await this.driver.findElement(By.name('LastName')).sendKeys(contactData.LastName);
        await this.driver.findElement(By.name('AccountId')).sendKeys(contactData.AccountName);
        await this.driver.findElement(By.xpath('//button[text()="Save"]')).click();
    }
}

module.exports = ContactPage;
```

---

### `accountPage.js`
```javascript
const { By } = require('selenium-webdriver');

class AccountPage {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Open a specific account page by ID
     * @param {string} accountId - The Salesforce Account ID
     */
    async openAccountPage(accountId) {
        const url = `/lightning/r/Account/${accountId}/view`;
        await this.driver.get(url);
    }

    /**
     * Get the account's details (example: Account Name)
     * @returns {Promise<string>} - Account Name
     */
    async getAccountName() {
        const nameElement = await this.driver.findElement(By.css('.entityNameTitle'));
        return await nameElement.getText();
    }

    /**
     * Create a new account
     * @param {Object} accountData - Account data (fields and values)
     */
    async createAccount(accountData) {
        await this.driver.findElement(By.xpath('//button[text()="New"]')).click();

        // Wait for the form to appear and fill it in
        await this.driver.findElement(By.name('Name')).sendKeys(accountData.Name);
        await this.driver.findElement(By.name('Phone')).sendKeys(accountData.Phone);
        await this.driver.findElement(By.name('Website')).sendKeys(accountData.Website);
        await this.driver.findElement(By.xpath('//button[text()="Save"]')).click();
    }
}

module.exports = AccountPage;

```

### Key Features:
1. **`openContactPage` / `openAccountPage`**:
   - Navigates to the specific record's page using its Salesforce ID.

2. **`getContactName` / `getAccountName`**:
   - Retrieves the name displayed on the Contact or Account record.

3. **`createContact` / `createAccount`**:
   - Automates the creation of new Contacts and Accounts through the Salesforce UI.

These Page Object Model files are modular and reusable for CRUD operations on **Contacts** and **Accounts** in Salesforce.
---

#### 3. **Service Layer**
**`salesforceAPI.js`**
```javascript
const axios = require('axios');
const qs = require('qs');
const config = require('../config/config.json');

class SalesforceAPI {
    constructor() {
        this.tokenUrl = "https://login.salesforce.com/services/oauth2/token";
    }

    async authenticate() {
        const data = qs.stringify({
            ...config.oauth,
            username: config.username,
            password: config.password
        });

        const response = await axios.post(this.tokenUrl, data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return {
            accessToken: response.data.access_token,
            instanceUrl: response.data.instance_url
        };
    }

    async performCRUD(instanceUrl, accessToken, sObject, method, data = {}, id = "") {
        const url = `${instanceUrl}/services/data/v57.0/sobjects/${sObject}/${id}`;
        const headers = { Authorization: `Bearer ${accessToken}` };

        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        });

        return response.data;
    }
}

module.exports = new SalesforceAPI();
```

---

#### 4. **Utility Functions**
**`webdriverSetup.js`**
```javascript
const { Builder } = require('selenium-webdriver');

const buildDriver = async (browser = 'chrome') => {
    return await new Builder().forBrowser(browser).build();
};

module.exports = buildDriver;
```

**`helpers.js`**
```javascript
const waitForElement = async (driver, locator, timeout = 10000) => {
    const { until } = require('selenium-webdriver');
    await driver.wait(until.elementLocated(locator), timeout);
};

module.exports = { waitForElement };
```

---

#### 5. **Test Scripts**
**`loginTest.js`**
```javascript
const buildDriver = require('../utils/webdriverSetup');
const LoginPage = require('../pages/loginPage');
const config = require('../config/config.json');

(async () => {
    const driver = await buildDriver();

    try {
        const loginPage = new LoginPage(driver);
        await loginPage.open();
        await loginPage.login(config.username, config.password);

        console.log('Login successful!');
    } catch (error) {
        console.error('Error in login test:', error);
    } finally {
        await driver.quit();
    }
})();
```

**`leadTest.js`**
```javascript
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
```

### `contactTest.js`
```javascript
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
```

---

### `accountTest.js`
```javascript
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
```
---

### Key Features:
1. **Authentication**:
   - Logs in via the Salesforce UI.
   - Uses REST API for initial record creation.

2. **Record Verification**:
   - Confirms record creation by retrieving and validating the name through the UI.

3. **Extendable**:
   - Add steps for editing, deleting, or other CRUD operations as needed.

4. **Error Handling**:
   - Includes try-catch blocks for robust error reporting.
     
---

### Features

1. **Separation of Concerns**:
   - **POM** for UI operations.
   - **Service Layer** for API operations.
   - **Utility Layer** for helper methods.

2. **Scalability**:
   - Easy to extend with new SObjects and features.
   - Reusable methods for CRUD operations and authentication.

3. **Configurability**:
   - Centralized `config.json` for test data and credentials.

4. **Maintainability**:
   - Modular structure simplifies debugging and enhancements.

This framework can be further extended to cover complex workflows, additional SObjects, or Salesforce-specific features like Chatter or Reports.
Here are the implementations for **contactPage.js** and **accountPage.js** using the Page Object Model design pattern:

---

