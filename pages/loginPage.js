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