/* output -> SHOULD RETURN A REQUEST OBJECT. download the resource at the url to the local path on your machine.
Upon completion it hsould print out a message -> Downloaded and saved 1235 bytes to ./index.html

input-> a url, a local file path. A Function is needed

steps-> 

1. make a http request and wait for the response
2. after the http request is complete, you need to tkae the data you receive and write it yo a faile in your local filesystem
When you're trying to control the order of asynchronous operations, you can use nested callbacks.

*/
const request = require('request');
const fs = require('fs');

let URL = process.argv[2];
let pathFile = '/home/aman/Desktop/newFileName'; //newFileName needs to be added to the path to tell the fswrite to CREATE A NEW FILE using this name here. If not fswriter will try to overwrite /home/aman/dekstop... 

const urlFetcher = function(url, callback) {
  request (url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const content = body;
    return callback(null, content);
  })
};

const urlDownloader = function(content, path, callback) {
  fs.writeFile(path, content, error => {
    if (error) {
      return callback(error,null);
    }
    let confirmation = `Downloaded and saved ${content.length} bytes to ${pathFile}`;
    return callback(null, confirmation);
  })
}


const pageFetcher = function(url, path, callbackData) { //callbackData is going to be a function that takes in an error, result. If error -> return the error to the calback. If not error (success), the urlfetcher code will return the content (via its callback) which is a result/data that can be applied in the overall funciton itself as its just data in the funciton scope. This can be passed on to the next function
  urlFetcher(url, (error, content) => {
    if (error) {
      return callbackData(error);
    }
    urlDownloader(content, path, (error, confirmation) => {
      if (error) {
        return callbackData(error);
      }
      callbackData(null, confirmation);
    })
  })
};

//TEST
pageFetcher(URL, pathFile, (error, result) => {
  if (error) {
    console.log(error)
  } else {
    console.log(result);
  }
});

//KEY NOTES
// THE CALLBACK IS NEEDED FOR ASYNCS FOR ITS TWO PARAMS/ARGS. AN ERROR OR RESULT. YOU NEED CALLBACKS FOR ERROR HANDLINg YOU COULD HYOPTEHTICALY JUST CALL RESULT AND NO CALBACK IN YOUR ASYNCS ABOVE.
// THE NESTING OF THE ASYNCS FORCES ASYNCS TO GO IN AN ORDER. the nesting forces the urlFetcher to go first (which is needed), then if no error take the information/returned data and pass it to the next async function which is nested. If they werent nested they would execute at the same time
// you can pass args in nested asyncs as they are in the same funciton scope


//COMBO OF BOTH IN ONE
// const fetchAndSave = function(url, pathFile) {
//   request (url, (error, response, body) => {
//     if (error) {
//       console.log(error);
//       return;
//     }
//     const content = body;
//     fs.writeFile(pathFile, content, (error) => { //NOTICE THAT THIS IS NESTED SO IT HAS TO WAIT FOR THE FIRST ASYYNC
//       if (error) {
//         console.log("Failure to download and save");
//       } else {
//         console.log(`Downloaded and saved to ${pathFile}`); 
//       }
//     })
//   })
// };

// fetchAndSave(URL, pathFile);