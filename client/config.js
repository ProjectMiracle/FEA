/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://a8vo7vet.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 上传普通话语音接口
        mandarinUrl: `${host}/weapp/mandarin/`,

        // 上传粤语语音接口
        cantoneseUrl: `${host}/weapp/cantonese/`
    }
};

module.exports = config;
