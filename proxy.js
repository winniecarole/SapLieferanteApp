
"iuse strikt";

const { inspect } = require("util")
const express = require("express")
const httpProxy = require("http-proxy")
const fs = require("fs")
const proxy = new httpProxy.createProxyServer();

const appRoute = {
    target: "http://localhost:8080",
    changeOrigin: true
};
const routing = JSON.parse(fs.readFileSync("./odata.json"));

proxy.on("error", function (err, req, res) {
    res.status(502).header("Content-Type", "text/plain;charset=utf-8");

    console.log(inspect(err, false, 5, true))

    res.end("🤷🏻‍♂️ " + err.message);
});

var allowCrossDomain = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    // intercept OPTIONS method
    if ("OPTIONS" === req.method) {
        res.sendStatus(200);
    } else {
        var dirname = req.url.replace(/^\/([^\/]*).*$/, "$1");
        var route = routing[dirname] || appRoute;
        console.log(req.method + ": " + route.target + req.url);
        proxy.web(req, res, route);
    }
};

var app = express();
app.use(allowCrossDomain);
app.listen(8006);
console.log("Proxy started on http://localhost:8006");
