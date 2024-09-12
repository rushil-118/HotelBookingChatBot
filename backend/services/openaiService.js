const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateResponse(messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from "gpt-4" to "gpt-3.5-turbo"
      messages: messages,
      functions: [
        {
          name: "get_room_options",
          description: "Get available room options from the hotel",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "book_room",
          description: "Book a room at the hotel",
          parameters: {
            type: "object",
            properties: {
              roomId: {
                type: "integer",
                description: "The ID of the room to book"
              },
              fullName: {
                type: "string",
                description: "Full name of the guest"
              },
              email: {
                type: "string",
                description: "Email address of the guest"
              },
              nights: {
                type: "integer",
                description: "Number of nights to stay"
              }
            },
            required: ["roomId", "fullName", "email", "nights"]
          }
        }
      ]
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

module.exports = { generateResponse };
