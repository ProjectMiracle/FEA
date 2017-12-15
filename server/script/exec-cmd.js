/**
 * Created by yangyang on 17/3/13.
 */

var exec = require('child_process').exec;

var cmdStr = 'touch upload.js';

exec(cmdStr, function(err,stdout,stderr){
    if(err) {
        console.log('Error:'+stderr);
    } else {
        //var data = JSON.parse(stdout);
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    }
});