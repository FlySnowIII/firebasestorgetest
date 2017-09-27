const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const fs = require('fs');
const os = require('os');
const path = require('path');
const csv = require('csv');
const JSONStream = require('JSONStream');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

    const fileBucket    = 'fir-study-3d198.appspot.com';
    const filePath      = 'StayInfoList/style.css';
    // const file = gcs.bucket(fileBucket).file(filePath);
    // console.log('file name: ',file.name);

    const bucket = gcs.bucket(fileBucket);
    bucket.getFiles()
    .then((results) => {
      const files = results[0];

      console.log('Files:');
      files.forEach((file) => console.log(file.name));

    });

     response.send("Hello from Firebase!22222");
});

exports.stayInfoListFileComing = functions.storage.object().onChange(event => {
    const object = event.data; // The Storage object.
    
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    console.log("fileBucket : ",fileBucket);
    console.log("filePath : ",filePath);
    console.log("contentType : ",contentType);
    console.log("contentType : ",contentType);
    console.log("metageneration : ",metageneration);

});

exports.loadcsvfile = functions.https.onRequest((request, response) => {
    
        const fileBucket    = 'fir-study-3d198.appspot.com';
        const filePath      = 'StayInfoList/sample.csv';
        const file = gcs.bucket(fileBucket).file(filePath);
        const tempFilePath = path.join(os.tmpdir(), file.name);
        console.log('file name: ',file.name);

        file.download({
            destination: tempFilePath
        }).then(()=>{
            const columns = [
                'jis',
                'postNumOld',
                'postNum',
                'prefKana',
                'countryKana',
                'townKana',
                'pref',
                'country',
                'town',
                'etc1',
                'etc2',
                'etc3',
                'etc4',
                'etc5',
                'etc6'];
              
              const parser = csv.parse({columns: columns});
              const readableStream = fs.createReadStream(tempFilePath, {encoding: 'utf-8'});
              
              readableStream.pipe(parser);
              
              parser.on('readable', () => {
                var data;
                while (data = parser.read()) {
                  console.log(data);
                }
              });
              
              parser.on('end', () => {
                console.log('end');
              });
        });

        
    

    
         response.send("loadcsvfile3333333333333");
    });