/**
 * Created by Dominick Martelly on 7/6/2016.
 */

//Setup for our mongoDB
var config = {
    port: 27017,
    db: 'mongodb://localhost/ResumizerPro',
    host: 'localhost',
    sessionSecret: 'devSeshsecret'
};


//So other modules can use this db config module
module.exports = config;
