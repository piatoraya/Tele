var https = require('follow-redirects').https;
var fs = require('fs');
var qs = require('querystring');

var options = {
  'method': 'POST',
  'hostname': 'atlantich2h.com',
  'path': '/deposit/metode',
  'headers': {
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());

    // Menyimpan ke dalam file JSON
    fs.writeFile('response.json', body.toString(), function(err) {
      if (err) {
        return console.error(err);
      }
      console.log("The file was saved!");
    });
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = qs.stringify({
  'api_key': 'B4IIIkZWZZ1tUqDz1deXjUZi1IDtH9eDsNMeyqKirjmNp9WaLZ23uYzi5JdHzDjgTmngUsQS0ZUMVR7TS1ya1GJwQ4dzvqQ9bxDU'
});

req.write(postData);

req.end();
