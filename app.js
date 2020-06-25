const { promisify } = require("util");
const axios = require("axios");
const fs = require("fs");
const extract = require("extract-zip");
const StreamZip = require("node-stream-zip");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const http = require("http");
const request = require("request");
const { deflate, unzip } = require("zlib");
const do_unzip = promisify(unzip);

const hostname = "127.0.0.1";
const port = 4200;

// This endpoint does not need authorization
const url =
  "http://devlintest.blob.core.windows.net/mycontainer/contributors.zip";

/*
// Working locally but not working on Azure Portal
http.get("http://devlintest.blob.core.windows.net/mycontainer/contributors.zip", res => {
  let data = [], dataLen = 0;

  res.on('data', function(chunk) {
    data.push(chunk);
    dataLen += chunk.length;

  }).on('end', function() {
    const buf = Buffer.alloc(dataLen);

    for (let i = 0, len = data.length, pos = 0; i < len; i++) {
      data[i].copy(buf, pos);
      pos += data[i].length;
    }

    let zip = new AdmZip(buf);
    let zipEntries = zip.getEntries();

    for (let i = 0; i < zipEntries.length; i++) {
      if (zipEntries[i].entryName.includes("contributors"))
        console.log("True");
    }
  });
});
*/

/*
// Working locally but not working on Azure Portal
request.get(url, function(err, res, file) {
  console.log(file.toString().includes("contributors"));
});
*/

/*
// Working locally but not working on Azure Portal
request.get({url, encoding: null}, (err, res, body) => {
  const zipEntries = new AdmZip(body).getEntries()
   console.log(zipEntries.length);

  zipEntries.forEach((entry) =>  console.log(entry.entryName))
});
*/

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World!");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}
