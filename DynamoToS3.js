exports.handler =  (event, context, callback) => {    
    var dbRecords = new Array();
    event.Records.forEach((record) => {
        console.log('DynamoDB Record: %j', JSON.stringify(record.dynamodb));
        dbRecords.push(record.dynamodb.NewImage);
    });
    
    var x = 99999; // can be any number
    var rand = Math.floor(Math.random()*x) + 1;
    var objKey = new Date(Date.now()).getTime().toString() + "_" +  rand;
    putObjectToS3(process.env.BUCKET_NAME, objKey , JSON.stringify(dbRecords));
    callback(null,  `Successfully processed ${event.Records.length} records.`);
};

var AWS = require('aws-sdk');
function putObjectToS3(bucket, key, data){
    console.log("Writing to S3 key="+key);
    var s3 = new AWS.S3();
    var params = {
        Bucket : bucket,
        Key : key,
        Body : data
    }
    return s3.putObject(params, function(err, data) {
      if (err) {
          console.log("Error uploading to S3: "+ data +" error: "+ err, err.stack);
          throw new Error("Error uploading to S3 : ");
      }
      else{
          console.log("uploaded to S3");           // successful response
      }
    });
}
