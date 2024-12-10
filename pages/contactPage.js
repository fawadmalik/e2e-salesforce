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
