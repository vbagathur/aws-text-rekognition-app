
let dotenv = require('dotenv').config();
var AWS = require('aws-sdk');
const { insertRecord } = require('./aws-dynamodb');

const bucket = process.env.BUCKET_NAME // the bucketname without s3://

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}) 
AWS.config.update({region: process.env.REGION_NAME});
const client = new AWS.Rekognition();

async function recognizeReceipt(userId,receiptNo,targetFile) {
  
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: targetFile
      },
    },
  }

  let retText=[];
  client.detectText(params, function(err, response) {
    if (err) {
      console.log(err, err.stack); // handle error if an error occurred
    } else {
      console.log(`Detected Text for: ${targetFile}`)
      response.TextDetections.forEach(label => retText.push(label.DetectedText))
      console.log(retText);
                        
      insertRecord(userId,receiptNo,targetFile,retText);
      // console.log(response)
      // response.TextDetections.forEach(label => {
        // console.log(`${label.DetectedText}`)
        // console.log(`Type: ${label.Type}`),
        // console.log(`ID: ${label.Id}`),
        // console.log(`Parent ID: ${label.ParentId}`),
        // console.log(`Confidence: ${label.Confidence}`),
        // console.log(`Polygon: `)
        // console.log(label.Geometry.Polygon)
      // })
    } 
  });
  return retText;
}

module.exports.recognizeReceipt = recognizeReceipt;