import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import webpush from "web-push";
import * as WebSocket from "ws";

const app: express.Application = express();
const port: any = parseInt(process.env["PORT"] || "8080");

const publicVapidKey = "BK9WyTntubhYmSo5dlE6mlJW06XiPtZrZa5EdGLUyLp1RA8AHj8Q3sqlPmQOC7WpKtxhVxW9BBH0z4FXqUU7hsQ";
const privateVapidKey = "bYcComPFP5EAfx72uq2SJiSpdXzobMmqy8xARBR-aT4";
webpush.setVapidDetails("mailto:adammauger@outlook.com", publicVapidKey, privateVapidKey);

// ajm: -------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/subscribe", (request: express.Request, response: express.Response) => {
  console.info(`app.post(/subscribe, ${request.path})`);
  const payload: string = JSON.stringify({ payload: request.body.payload, title: "Sunstealer Push Notification" });
  const subscription: any = request.body.subscription;
  response.status(201).json({});
  webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

app.use("/oidc", (request: express.Request, response: express.Response) => {
  console.info(`app.use(/oidc, ${request.path})`);
  response.sendFile(path.join(__dirname, "./index.html"));
});

app.get(/.*/, (request: express.Request, response: express.Response) => {
  console.info(`app.use(*, ${request.path})`);
  response.sendFile(path.join(__dirname, "./index.html"));
});

const server: any = http.createServer(app).listen(port, () => {
  console.info(`sunstealer: https://localhost:${port}`);
});

// ajm: websocket
/* const wss: WebSocket.Server<WebSocket> = new WebSocket.Server<WebSocket>({ server });

wss.on("listening", () => {
});

wss.on("connection", (connection) => {
  (connection as any).on("message", (message: any) => {
  });

  (connection as any).on("close", () => {
  });

});*/

