const config = require('./config');
const { INFO, ERROR } = require('./logs');
const { FilgreenClient } = require('./filgreen-client');

var express = require("express");
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());

let state = {
    timestamp : new Date().toISOString(),
    list_api : true,
    model_api : true,
    export_api : true
}

let filgreenClient = new FilgreenClient(config.filgreen.api);


app.get("/", async function (req, res, next) {
    res.json(state);
});

app.listen(config.filgreen.api_port, () => {
    INFO("FilGreen Monitor running on port: " + config.filgreen.api_port);
   });

async function update_state(params) {
    INFO('Update State');

    state.list_api = await filgreenClient.CheckListAPI();
    state.model_api = await filgreenClient.CheckModelAPI();
    state.export_api = await filgreenClient.CheckExportAPI();

    state.timestamp = new Date().toISOString()
}

const pause = (timeout) => new Promise(res => setTimeout(res, timeout * 1000));

const mainLoop = async _ => {
    
    try {
        await update_state();

        INFO(`Pause for 15 minutes`);
        await pause(15 * 60);

    } catch (error) {
        ERROR(`[MainLoop] error :`);
        console.error(error);
        ERROR(`Shutting down`);
        process.exit(1);
    }
    
}

mainLoop();

function shutdown(exitCode = 0) {
    stop = true;
    setTimeout(() => {
        INFO(`Shutdown`);
        process.exit(exitCode);
    }, 3000);
}
//listen for TERM signal .e.g. kill
process.on('SIGTERM', shutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutdown);