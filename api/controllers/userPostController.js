'use strict';
const { v4: uuidv4 } = require('uuid');

/**
 * AWS MODULE
 */
var AWS = require('aws-sdk');
const { json } = require('express');
const { post, response, param } = require('../../server');
    
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

    console.log(params);
    docClient.put(params, function(err, data) {
        if (err) {
            res.status(500).json({"error":"server error","err":err});
            return;
        } else {
            res.status(200).json(data)
        }
    });
}

async function GetFollowedUsers(params) {
    try {
        const data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}

async function AppendFollowedUsers(params) {
    try {
        const data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}

async function GetUserName(params) {
    try {
        const data = await docClient.get(params).promise();
        const item = data.Item;
        return item.userName + ' ' + item.lastName;
    } catch (err) {
        return err;
    }
}

exports.list_posts = async function(req, res) {

    /**
     * obtener solo a los que está suscrito
     */
    
    var params = {
        TableName: 'Users',
        ProjectionExpression: 'following',
        FilterExpression: 'userid = :_userid',
        ExpressionAttributeValues: {
            ':_userid' : req.body.userid
        }
    }

    const following = await GetFollowedUsers(params);

    var posts = []


    for (const element of following.Items[0].following.values) {
        params = {
            TableName: 'gamepostPosts',
            FilterExpression: 'contains(userid, :_userid) or contains(userid, :_myid)',
            ExpressionAttributeValues: {
                ':_userid' : element,
                ':_myid' : req.body.userid
            }
        }
        
        await AppendFollowedUsers(params).then(Promise => {
            posts.push(Promise.Items);
        });
    }
    console.log("Posts: ", posts)
    for (var PostElement of posts[0]) {
        console.log("PostsElement: ", PostElement)
        params = {
            TableName: 'Users',
            Key: {
                'userid': PostElement.userid
            }
        }

        const name = await GetUserName(params);
        PostElement.name = name;
    }
    
    console.log("Posts: ", posts)

    res.json(posts);
};