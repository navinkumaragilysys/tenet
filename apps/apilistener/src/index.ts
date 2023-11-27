const app = require("express")();
const { HTTP } = require("cloudevents");

app.post("/", (req:any, res:any) => {
  // body and headers come from an incoming HTTP request, e.g. express.js
  const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
  console.log(receivedEvent);
});