
let dotenv = require('dotenv').config();
var AWS = require('aws-sdk');

const bucket = process.env.BUCKET_NAME // the bucketname without s3://
const photo  = process.env.TEST_IMAGE_FILE // the name of file

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}) 
AWS.config.update({region: process.env.REGION_NAME});
const client = new AWS.Rekognition();
const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    },
  },
}

client.detectText(params, function(err, response) {
  if (err) {
    console.log(err, err.stack); // handle error if an error occurred
  } else {
    console.log(`Detected Text for: ${photo}`)
    // console.log(response)
    response.TextDetections.forEach(label => {
      console.log(`${label.DetectedText}`)
      // console.log(`Type: ${label.Type}`),
      // console.log(`ID: ${label.Id}`),
      // console.log(`Parent ID: ${label.ParentId}`),
      // console.log(`Confidence: ${label.Confidence}`),
      // console.log(`Polygon: `)
      // console.log(label.Geometry.Polygon)
    } 
    )
  } 
});