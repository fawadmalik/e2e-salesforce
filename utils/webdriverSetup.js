const { Builder } = require('selenium-webdriver');

const buildDriver = async (browser = 'chrome') => {
    return await new Builder().forBrowser(browser).build();
};

module.exports = buildDriver;
