const axios = require("axios");
const FormData = require("form-data");
let data = new FormData();
data.append("username", "manuel.miranda@trustsaude.pt");
data.append("password", "manelit123456");

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://trust-saude.rossum.app/api/v1/auth/login",
  headers: {
    Cookie:
      "rossum-csrf-token=uSJug629adw1t3BpMWS1dwLCSRsuIljk; rossum-session=y3yjr5oxvkk7aj17teufs624diu5yro0",
    ...data.getHeaders(),
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
