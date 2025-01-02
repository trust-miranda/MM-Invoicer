const http = require("http");
const ngrok = require("@ngrok/ngrok");

// Create webserver
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Congrats you have created an ngrok web server");
  })
  .listen(8080, () => console.log("Node.js web server at 8080 is running..."));

// Get your endpoint online
ngrok
  .connect({
    addr: 8080,
    authtoken: "2qHBDGnIbQ0ErzhJ6pB2raT5P8I_74brni1n3Z4aHEGM1pdSu",
  })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`))
  .catch((error) => console.error("Error connecting to ngrok:", error));
