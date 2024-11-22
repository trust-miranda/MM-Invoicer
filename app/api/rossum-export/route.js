const fetch = require("node-fetch");
const fs = require("fs");

const queue_id = 1177502;
const loginUrl = `https://trust-saude.rossum.app/api/v1/auth/login`;
const username = "manuel.miranda@trustsaude.pt";
const password = "manelit123456";

let today = new Date();
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const pad = (number) => (number < 10 ? "0" + number : number);
const toISOString = (date) =>
  date.getUTCFullYear() +
  "-" +
  pad(date.getUTCMonth() + 1) +
  "-" +
  pad(date.getUTCDate());

const makeUrl = (id, date_start, date_end) =>
  `https://trust-saude.rossum.app/api/v1/queues/${id}/export?status=failed_export&format=json&page_size=100&page=1`;

const createHeaders = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `token ${token}`,
  },
});

const fetchXMLs = (date_start, date_end, token) => {
  const dataStream = fs.createWriteStream(
    "data_" + date_start.getTime() + "_" + date_end.getTime() + ".json"
  );
  fetch(makeUrl(queue_id, date_start, date_end), createHeaders(token))
    .then((r) => r.body.pipe(dataStream))
    .catch(console.error);
};

fetch(loginUrl, {
  method: "POST",
  body: JSON.stringify({ username, password }),
  headers: { "Content-Type": "application/json" },
})
  .then((r) => r.json())
  .then(({ key }) => {
    fetchXMLs(yesterday, today, key);
  });

console.log("Data are being fetched from Rossum...");
