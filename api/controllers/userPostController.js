'use strict';
const { v4: uuidv4 } = require('uuid');

/**
 * AWS MODULE
 */
var AWS = require('aws-sdk');
    
 /**
  * Mac/Linux: ~/.aws/credentials en Mac/Linux
  * Windows: C:\Users\USERNAME\.aws\credentials
  * Guide: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
  */
var credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;

AWS.config.update({
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.create_a_post = function(req, res) {
    const id = uuidv4();
    var params = {
        TableName: 'gamepostPosts',
        Item: {
            'postid': id,
            'userid': req.body.userid,
            'content': req.body.content
        }
    }
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add post. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded");
        }
    });
}

exports.list_posts = function(req, res) {
    var params = {
        TableName: 'gamepostPosts',
    }
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to add post. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Get items succeeded");
            console.log(JSON.stringify(data));
            res.json(data);
        }
    });
}