// createDeposit.js
const https = require('follow-redirects').https;
const fs = require('fs');
const config = require('./config');
const qs = require('querystring');
const crypto = require('crypto');

function generateReffId() {
  return crypto.randomBytes(8).toString('hex');
}

function saveToJsonFile(data, filename) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return;
    }
    console.log(`Saved deposit response to ${filename}`);
  });
}

// Fungsi baru untuk membuat request deposit
async function makeDepositRequest(nominal, type, method) {
  const apiDataDeposit = qs.stringify({
    'api_key': config.api_key,
    'reff_id': generateReffId(),
    'nominal': nominal,
    'type': type,
    'metode': method
  });

  const options = {
    'method': 'POST',
    'hostname': config.hostname,
    'path': '/deposit/create',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    'maxRedirects': 20
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      let chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        try {
          const jsonData = JSON.parse(body.toString());
          saveToJsonFile(jsonData, 'depositResponse.json'); // Menyimpan respon ke file
          resolve(jsonData); // Mengembalikan respon
        } catch (error) {
          console.error("Error parsing JSON:", error);
          reject(error);
        }
      });
      res.on("error", function (error) {
        console.error(error);
        reject(error);
      });
    });

    req.write(apiDataDeposit);
    req.end();
  });
}

// Ekspos fungsi makeDepositRequest
module.exports = { makeDepositRequest };
