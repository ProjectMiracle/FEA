var router = require('koa-router')();

router.post('/', async function (ctx, next) {
    console.log(ctx.request.body);
});

module.exports = router;