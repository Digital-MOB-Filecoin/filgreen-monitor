const axios = require('axios');
const { INFO, ERROR, WARNING } = require('./logs');

class FilgreenClient {
    constructor(api, token) {
        this.api = api;
    }

    async Get(url) {
        let response = undefined;

        try {
            response = await axios.get(url);
    
        } catch (e) {
            ERROR(`Get ${url} -> error: ${e}`);
        }

        return response;
    }

    async CheckListAPI() {
        let result = false;
        let models = (await this.Get(this.api + 'models/list'))?.data;
        if (models?.length > 0) { 
            result = true;
        }
        if (result) {
            INFO('CheckListAPI up');
        } else {
            WARNING('CheckListAPI down');
        }
        return result;
    }

    async CheckModelAPI() {
        let result = false;
        let model_data = (await this.Get(this.api + 'models/model?code_name=CapacityModel&start=2022-01-01&end=2022-05-15&filter=day'))?.data;
        if (model_data && model_data.code_name === 'CapacityModel') { 
            result = true;
        }
        if (result) {
            INFO('CheckModelAPI up');
        } else {
            WARNING('CheckModelAPI down');
        }
        return result;
    }

    async CheckExportAPI() {
        let result = false;
        let export_data = (await this.Get(this.api + 'models/export?code_name=CapacityModel&start=2022-01-01&end=2022-05-15&offset=0&limit=100'))?.data;
        if (export_data && export_data.fields[1] === 'capacity_GiB') { 
            result = true;
        }
        if (result) {
            INFO('CheckExportAPI up');
        } else {
            WARNING('CheckExportAPI down');
        }
        return result;
    }
}

module.exports = {
    FilgreenClient
};