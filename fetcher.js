const request = require('request');
const fs = require('fs');

let URL = process.argv[2];
let pathFile = '/home/aman/Desktop/newFileName';

const pageFetcher = function(url, pathFile) {
  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
      return;
    }
    const content = body;
    fs.writeFile(pathFile, content, (error) => { //NOTICE THAT THIS IS NESTED SO IT HAS TO WAIT FOR THE FIRST ASYNC
      if (error) {
        console.log("Failure to download and save");
      } else {
        console.log(`Downloaded and saved ${content.length} bytes to ${pathFile}.`);
      }
    });
  });
};

pageFetcher(URL, pathFile);