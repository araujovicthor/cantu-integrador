const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: 'sa-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
});

module.exports = new AWS.DynamoDB.DocumentClient();
