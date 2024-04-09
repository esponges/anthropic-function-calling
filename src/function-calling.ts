import Anthropic from '@anthropic-ai/sdk';
import type { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages.mjs';
import dotenv from 'dotenv';
dotenv.config();

let apiKey: string | undefined = '';

if (process.env.ANTHROPIC_API_KEY !== '') {
  apiKey = process.env.ANTHROPIC_API_KEY;
}

const anthropic = new Anthropic({
  apiKey
});

const MODEL_NAME = 'claude-3-haiku-20240307';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function getWeather (location: string) {
  const tools: Tool[] = [
    {
      name: 'get_weather',
      description: 'Get the weather in celsius for a given location',
      input_schema: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location to get the weather for',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'The unit to return the temperature in',
          },
          temperature: {
            type: 'number',
            description: 'The temperature to return',
          },
        },
      },
    },
  ];

  const query = `
  <text>
   ${location}
  </text>

  Use the get_weather tool.
  `;

  const response = await anthropic.beta.tools.messages.create({
    model: MODEL_NAME,
    max_tokens: 4096,
    tools,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  });

  return response;
}

getWeather('Guadalajara, Jalisco')
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
