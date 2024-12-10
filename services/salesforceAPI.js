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
