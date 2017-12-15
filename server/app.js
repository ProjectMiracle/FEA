const Koa = require('koa');
const app = new Koa();
const debug = require('debug')('koa-weapp-demo');
const router = require('koa-router')();
const convert = require('koa-convert');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const path = require('path');

const response = require('./middlewares/response');
const bodyParser = require('koa-bodyparser');

const config = require('./config')

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

const index = require('./routes/index');
router.use('/', index.routes(), index.allowedMethods());

const callback = require('./routes/callback');
router.use('/weapp/callback', callback.routes(), callback.allowedMethods());

const mandarin = require('./routes/mandarin');
router.use('/weapp/mandarin', mandarin.routes(), mandarin.allowedMethods());

const cantonese = require('./routes/cantonese');
router.use('/weapp/cantonese', cantonese.routes(), cantonese.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
    console.log(err)
    logger.error('server error', err, ctx);
});

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))