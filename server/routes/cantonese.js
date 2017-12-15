const router = require('koa-router')();
const multer = require('koa-multer');
const path = require('path');
const speech = require('../script/speech');
const process = require('../script/process');
const moment = require('moment-timezone');
const {mysql} = require('../qcloud');
const AccountNumber = '001000001001';

let cantonese = multer({ dest: path.resolve('/data/release/node-weapp-demo/voice-file')});

/**
 * 上传录音文件
 */
router.post('/', cantonese.single('file'), async function (ctx, next) {
    console.log(ctx.req.file);
    let result = {};
    let res = await speech.silkToWav(path.resolve('/data/release/node-weapp-demo/voice-file/' + ctx.req.file.filename));
    let resText, balance, credit;
    if (res.result) {
        console.log('转换为 wav 格式成功');
        let filePath = path.resolve('/data/release/node-weapp-demo/voice-file/' + ctx.req.file.filename + '.wav');
        let base64Data = await speech.base64_encode(filePath);
        let fileInfo = await speech.fileStat(filePath);
        let recogniz = await speech.recognizeCt(base64Data.msg, fileInfo.msg.size);
        console.log('recogniz: ' + JSON.stringify(recogniz));
        let resultMsg = recogniz.msg;
        console.log('resultMsg: ' + resultMsg);
        console.log('开始识别指令');
        let jsonResult = JSON.parse(resultMsg);
        let jsonMsg = jsonResult.result[0];
        console.log('jsonMsg: ' + jsonMsg);
        let decodeStr = await speech.decodeSpeech(jsonMsg);
        console.log('decodeStr' + JSON.stringify(decodeStr));
        let decodeJson = JSON.parse(decodeStr.msg);
        switch (decodeJson.oper) {
            case 1:
                balance = await mysql('Account_Balance').select('Account_Balance').where({Account_Number: AccountNumber});
                console.log(balance);
                resText = encodeURI("您的账号当前余额为" + balance[0].Account_Balance + "元");
                break;
            case 2:
                let times = decodeJson.args[1];
                let exchArray = await mysql('Account_Transaction').select('*').where({Account_Number: AccountNumber}).orderBy('Posting_Date', 'desc').limit(times);
                resText = '以下是您最近的交易记录。';
                for (let i = 0; i < exchArray.length; i++) {
                    credit = exchArray[i].Transaction_Amount > 0 ? '收入' : '支出';
                    let curTime = moment(exchArray[i].Posting_Date).tz('Asia/Shanghai').format('YYYY年M月D日');
                    resText = resText + '您在' + curTime + credit + Math.abs(exchArray[i].Transaction_Amount).toString() + '元' + exchArray[i].Transaction_Narrative + '。';
                }
                break;
            case 3:
                let payee = decodeURI(decodeJson.args[0]);
                let amount = decodeJson.args[1];
                let curTime = moment(start).tz("Asia/Shanghai").format("H时m分");
                console.log('curTime: ' + curTime);
                let payeeRst = await mysql('Preset_Payee').select('Country_Code', 'Group_Member').where({Account_Name: payee});
                console.log('payeeRst: ' + JSON.stringify(payeeRst));
                if (payeeRst.length == 0) {
                    resText = encodeURI('转账失败，转入方不在预设受益人中');
                } else {
                    let countryCode = payeeRst[0].Country_Code;
                    let groupMember = payeeRst[0].Group_Member;
                    let frwd = await mysql('Account_Balance').where({Account_Number: AccountNumber}).decrement('Account_Balance', amount);
                    balance = await mysql('Account_Balance').select('Account_Balance').where({Account_Number: AccountNumber});
                    console.log(JSON.stringify(balance));
                    resText = encodeURI('您于' + curTime + '已成功向' + countryCode + groupMember + '的' + payee + '转账' + amount + '元，您的账号当前余额为' + balance[0].Account_Balance + '元');
                }
                break;
            case 99:
                resText = decodeJson.args[0];
                break;
            default:
                resText = process.unknownOper();
        }
        result = {
            requestText: jsonMsg,
            restext: resText
        };
        console.log(result);
    } else {
        console.log('无法转换为 wav 格式: ' + JSON.stringify(res.msg));
        result = {
            // 抱歉，未能听懂您的指令
            requestText: jsonMsg,
            restext: process.unknownOper()
        };
    }
    ctx.response.body = result;
});

module.exports = router;
