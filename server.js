const fs = require('fs');
const http = require('http');
const PORT = 8000;
const https = require('https');
const qs = require('querystring');
const config = require('./config/config.js');

const path = require('path');
let FILE = process.argv[2];
FILE = path.resolve('./', FILE);

const server = http.createServer((req, res) => {
  console.log('req url', req.url);
  console.log(req.method);
  switch (req.method) {
    case 'GET':
      if (req.url == '/') {
        console.log('dead');
        fs.readFile(`${FILE}`, (err, data) => {
          res.end(data);
        });
      } else {
        var location = path.join(__dirname, req.url) //
        console.log('loca', location);
        fs.readFile(location, (err, data) => {
          console.log('hey this is data', data);
          res.end(data);
        });
      }
      break;
    case 'POST':
      handleAPI(req, res);
      break;
    default:
      console.log('Did not handle this.');
  }
});

function handleAPI(req, res) {
  var reqBody = '';
  req.on('data', function(data) {
    reqBody += data;
    if(reqBody.length > 1e7) {
      response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
      response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
    }
  });
  req.on('end', function() {
    var formData = JSON.parse(reqBody);
    console.log('fd', formData);

    var options = {
      "method": "POST",
      "hostname": "gateway.watsonplatform.net",
      "port": null,
      "path": "/tone-analyzer/api/v3/tone?version=2016-05-19",
      "headers": {
        "content-type": "application/json",
        "authorization": config.auth,
      }
    };

    var request = https.request(options, function (response) {
      var chunks = [];

      response.on("data", function (chunk) {
        chunks.push(chunk);
      });

      response.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.end(body.toString());
      });
    });

    request.write(JSON.stringify({ "text": formData.text }));
    request.end();

  });

}

server.listen(PORT, () => {
  console.log('Listening on http://localhost:%d', PORT);
});