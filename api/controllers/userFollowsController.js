'use strict';
const { v4: uuidv4 } = require('uuid');

/**
 * AWS MODULE
 */
var AWS = require('aws-sdk');
const { json } = require('express');
    
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

exports.search_users = function(req, res) {
    var params = {
        TableName: 'Users',
        FilterExpression: 'contains(userName, :search) or contains(lastName, :search)',
        ExpressionAttributeValues:{ 
            ":search" : req.body.parameter,
        }
    }

    docClient.scan(params, function(err, data) {
        if (err) {
            res.status(500).json({"error":"server error","err":err});
            return;
        } else {
            res.status(200).json(data);
        }
    })
}

exports.follow_user = function(req, res) {
    var params = {
        TableName: 'Users',
        Key: {
            "userid": req.body.userid,
        },
        UpdateExpression: "ADD #following :_user",
        ExpressionAttributeNames : {
            '#following' : 'following'
        },
        ExpressionAttributeValues: {
            ":_user" : docClient.createSet([req.body.followid])
        },
        ReturnValues: 'UPDATED_NEW'
    }

    docClient.update(params, function(err, data) {
        if (err) {
            res.status(500).json({"error":"server error","err":err});
            return;
        } else {
            res.status(200).json(data)
        }
    });
}