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
