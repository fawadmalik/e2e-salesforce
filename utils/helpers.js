const waitForElement = async (driver, locator, timeout = 10000) => {
    const { until } = require('selenium-webdriver');
    await driver.wait(until.elementLocated(locator), timeout);
};

module.exports = { waitForElement };
