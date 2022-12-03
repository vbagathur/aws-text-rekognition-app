const { dotenv } = require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetCommand,PutCommand,DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.REGION_NAME });

const TABLE_NAME="receipts";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

async function insertRecord(userId, receiptId, imgFileURL, detText) {
  // Set the parameters.
  const timestamp = new Date();
  const params = {
      TableName: TABLE_NAME,
      Item: {
          "receipt-id": userId + '-' + receiptId,
          "file": imgFileURL,
          "text": detText
      },
      };
  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
}

async function queryRecord(userId, receiptId) {
  // Set the parameters.
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "receipt-id": userId + '-' + receiptId
    },
  };
  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log("Item :", data.Item);
    if (data.Item) return data.Item.text;
  } catch (err) {
    console.log("Error", err);
  }
  return false;
}

module.exports.queryRecord = queryRecord;
module.exports.insertRecord = insertRecord;
