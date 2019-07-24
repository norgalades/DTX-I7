var aws = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'})
var params = {
  Message: 'OFF LINE TURBINE',
  TopicArn: 'arn:aws:sns:eu-central-1:197099301124:turbineDown'
};

var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise(); // Handle promise's fulfilled/rejected states publishTextPromise.then(
  function(data) { console.log("Message ${params.Message} send sent to the topic ${params.TopicArn}"); console.log("MessageID is " + data.MessageId);
}).catch(
  function(err) {
    console.error(err, err.stack);
});
