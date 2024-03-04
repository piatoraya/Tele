// cancelDeposit.js
const https = require('follow-redirects').https;
const fs = require('fs');
const { api_key, hostname } = require('./config');
const qs = require('querystring');

function saveToJsonFile(data, filename) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return;
    }
    console.log(`Saved deposit cancellation response to ${filename}`);
  });
}

const postData = qs.stringify({
  'api_key': api_key,
  'id': 'ZymbNFEHqB7aZ7J64Q1f' // Ganti dengan ID transaksi yang valid
});

const options = {
  'method': 'POST',
  'hostname': hostname,
  'path': '/deposit/cancel',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  'maxRedirects': 20
};

const req = https.request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    try {
      // Mengasumsikan respons API adalah JSON
      const jsonData = JSON.parse(body.toString());
      // Menyimpan respons dalam format array yang terstruktur
      const structuredArray = [jsonData]; // Mengemas data dalam array
      saveToJsonFile(structuredArray, 'cancelDepositResponse.json');
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.write(postData);
req.end();
