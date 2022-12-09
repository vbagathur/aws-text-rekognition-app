// Create a service client module using ES6 syntax.
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
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



const getItem = async () => {
    // Set the parameters.
    const params = {
      TableName: TABLE_NAME,
      Key: {
        "receipt-id": "vishreceipt3"
      },
    };
    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      console.log("Item :", data.Item);
      if (data.Item) return true;
    } catch (err) {
      console.log("Error", err);
    }
    return false;
  };

const putItem = async () => {
    // Set the parameters.
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "receipt-id": "vishreceipt3",
            "file": "vishreceipt3.png"
        },
        };
    try {
      const data = await ddbDocClient.send(new PutCommand(params));
      console.log("Success - item added or updated", data);
    } catch (err) {
      console.log("Error", err.stack);
    }
  };


const checkItem = async () => {
    if (await getItem()) {
        console.log("Error - item already exists");
    } else {
        console.log("Putting new item");
        await putItem();
    }
}

checkItem();
  
  