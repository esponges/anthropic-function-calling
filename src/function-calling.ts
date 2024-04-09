import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '@anthropic-ai/sdk/resources/beta/tools/messages.mjs';
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL_NAME = 'claude-3-haiku-20240307';

function getWeather(location: string) {
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

  const response = anthropic.beta.tools.messages.create({
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

console.log(getWeather('Guadalajara, México'));
