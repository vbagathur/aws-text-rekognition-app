let dotenv = require('dotenv').config();
var AWS = require('aws-sdk');
let fs = require('fs');

const bucket = process.env.BUCKET_NAME // the bucketname without s3://

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION_NAME
});

const getFileStream = (fileKey) => {
    const downloadParams = {
    Key: fileKey,
    Bucket: bucket,
  };
  return s3.getObject(downloadParams).createReadStream();
}

exports.copyFileToBucket = (localFilePath) => {
  // Read content from the file
  const fileContent = fs.readFileSync(localFilePath);

  // Setting up S3 upload parameters
  const params = {
      Bucket: bucket,
      Key: localFilePath, // File name you want to save as in S3
      Body: fileContent
  };

  // Uploading files to the bucket
  let status;
  try {
    status = s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
  }catch(e){
    console.log(e);
  }
  
  return status;
};