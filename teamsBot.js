const { ActivityHandler } = require('botbuilder');
const axios = require('axios');
require('dotenv').config();  // 加载环境变量

class GPT4Bot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;

            try {
                // 调用ChatGPT API
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-4-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 150,
                    temperature: 0.9
                }, {
                    headers: {
                        'Authorization': `Bearer OPENAI_API_KEY`,
                        'Content-Type': 'application/json'
                    }
                });

                // 确保正确访问response.data中的数据
                const replyText = response.data.choices[0].message.content.trim();
                await context.sendActivity(replyText);
            } catch (error) {
                console.error(`Error calling OpenAI API: ${error.response ? error.response.data : error.message}`);
                await context.sendActivity('Sorry, something went wrong while processing your request.');
            }

            await next();
        });
    }
}

module.exports.GPT4Bot = GPT4Bot;