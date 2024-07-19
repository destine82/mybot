const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const { GPT4Bot } = require('./teamsBot');

// 创建服务器
const server = restify.createServer();
server.listen(3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});

// 创建适配器
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// 捕获所有的异常，防止程序崩溃
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// 实例化Bot
const bot = new GPT4Bot();

// 监听 /api/messages 路由，处理消息请求
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});