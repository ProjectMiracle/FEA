const fs = require('fs');
const request = require('request');
const exec = require('child_process').exec;

var speech = {};
module.exports = speech;

speech.base64_encode = function (file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err) {
                resolve({
                    result: false,
                    msg: '出现错误: ' + JSON.stringify(err)
                });
            } else {
                resolve({
                    result: true,
                    msg: new Buffer(data).toString('base64')
                });
            }
        });
    });
}

speech.fileStat = function (file) {
    return new Promise(function (resolve, reject) {
        fs.stat(file, function (err, data) {
            if (err) {
                resolve({
                    'result': false,
                    'msg': '出现错误: ' + JSON.stringify(err)
                });
            } else {
                resolve({
                    'result': true,
                    'msg': data
                });
            }
        });
    });
}

// 普通话语音识别
speech.recognizeZh = function (base64String, size) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'http://vop.baidu.com/server_api',
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "format": "wav",
                "rate": 16000,
                "channel": 1,
                "token": "24.7a1cfb22fbd7521622560da4f03f4dfc.2592000.1515433211.282335-1372250",
                "cuid": "2e:4b:82:f4:e7:20",
                "len": size,
                "speech": base64String,
                "lan": "zh"
            })
        }, function (error, response, data) {
            if (error) {
                resolve({
                    result: false,
                    msg: '出现错误: ' + JSON.stringify(error)
                });
            } else {
                resolve({
                    result: true,
                    msg: data
                });
            }
        });
    });
}

// 粤语语音识别
speech.recognizeCt = function (base64String, size) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'http://vop.baidu.com/server_api',
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "format": "wav",
                "rate": 16000,
                "channel": 1,
                "token": "24.7a1cfb22fbd7521622560da4f03f4dfc.2592000.1515433211.282335-1372250",
                "cuid": "2e:4b:82:f4:e7:20",
                "len": size,
                "speech": base64String,
                "lan": "ct"
            })
        }, function (error, response, data) {
            if (error) {
                resolve({
                    result: false,
                    msg: '出现错误: ' + JSON.stringify(error)
                });
            } else {
                resolve({
                    result: true,
                    msg: data
                });
            }
        });
    });
}

// 识别指令
speech.decodeSpeech = function (textString) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'http://139.159.224.26:3389/decode/',
            method: 'post',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: 'text=' + encodeURI(textString),
        }, function (error, response, data) {
            if (error) {
                resolve({
                    result: false,
                    msg: '{"oper":0,"args":[]}'
                });
            } else {
                resolve({
                    result: true,
                    msg: data
                });
            }
        });
    });
}

/**
 * 微信 silk 格式转换为 wav 格式
 */
speech.silkToWav = function (file) {
    return new Promise(function (resolve, reject) {
      exec('sh /data/release/node-weapp-demo/script/converter.sh ' + file + ' wav', function (err, stdout, stderr) {
            if (err) {
                resolve({
                    result: false,
                    msg: stderr
                });
            } else {
                console.log(stdout);
                console.log(stderr);
                resolve({
                    result: true,
                    msg: ''
                });
            }
        });
    });
}

