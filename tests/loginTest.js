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