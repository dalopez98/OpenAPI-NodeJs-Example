import * as fs from 'fs';
import OpenAI from "openai";

// VERSION: 4.3.1
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION
});

export default async function (req, res) {
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const message = req.body.message || '';
  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message.",
      }
    });
    return;
  }

  try {
    const messages = generateMessages(message)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // console.log(response);
    saveJsonPayload(response);
    res.status(200).json({ result: response.choices[0].message.content });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }

}

function generateMessages(input = '') {
  const initialPrompts = [
    {
      "role": "system",
      "content": "You will be provided with unstructured data, and your task is to parse it into JSON format, I need to know the data type of the values, so I'd like to have the key value structure as follows: \"key\": { \"value\": 0, \"type\": \"number\" }"
    },
    {
      "role": "user",
      "content": "Create a list of 10 countries with the following information, name, population, territorial extension"
    },
    {
      "role": "assistant",
      "content": "{\n  \"countries\": [\n    {\n      \"name\": {\n        \"value\": \"United States\",\n        \"type\": \"string\"\n      },\n      \"population\": {\n        \"value\": 331002651,\n        \"type\": \"number\"\n      },\n      \"territorial_extension\": {\n        \"value\": 9629091,\n        \"type\": \"number\"\n      }\n    },\n    {\n      \"name\": {\n        \"value\": \"China\",\n        \"type\": \"string\"\n      },\n      \"population\": {\n        \"value\": 1439323776,\n        \"type\": \"number\"\n      },\n      \"territorial_extension\": {\n        \"value\": 9640011,\n        \"type\": \"number\"\n      }\n    },\n    {\n      \"name\": {\n        \"value\": \"India\",\n        \"type\": \"string\"\n      },\n      \"population\": {\n        \"value\": 1380004385,\n        \"type\": \"number\"\n      },\n      \"territorial_extension\": {\n        \"value\": 3287263,\n        \"type\": \"number\"\n      }\n    },\n    {\n      \"name\": {\n        \"value\": \"Russia\",\n        \"type\": \"string\"\n      },\n      \"population\": {\n"
    },
    {
      "role": "user",
      "content": input
    }
  ];

  return initialPrompts;
}

function saveJsonPayload(json) {
  fs.writeFile("unstructured-data.json", JSON.stringify(json), 'utf-8', function(err) {
      if (err) {
          console.log(err);
      }
  });
}