# Hotel Booking Chatbot


This is a RESTful API for a hotel booking chatbot using Express.js and OpenAI's API.

## Setup Instructions

1. Clone the repository
2. Run `npm install` to install dependencies in both backend and fronend directory by doing `cd backend` and   `cd frontend`
3. Create a `.env` file in the backend directory and add your :-
```
OPENAI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
```
    
4. `npm install sqlite3 sequelize cors dotenv express openai nodemailer axios` in backend directory by `cd backend`
5. started the node server in backend directory by `node app.js`
6. Run `npm run start` to start the server

## API Endpoints

### POST /api/chat

Send a message to the chatbot and receive a response.

Request body:
```json :- 
{
"userId": "unique_user_id",
"message": "I want to book a room"
}  
```


Response :- 
``` 
{
  "response": "Certainly! I'd be happy to help you book a room. Let me fetch the available room options for you."
}
```


List of Hotel room command :-
```
curl -X GET https://bot9assignement.deno.dev/rooms

```

Create a booking :-

```
curl -X POST https://bot9assignement.deno.dev/book \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 2,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "nights": 3
  }'

```

Testing :- 
```
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "message": "I want to book a room"}'
```

Continue the conversation by sending more messages with the same userId to maintain the conversation history.

You can then interact with the chatbot by sending POST requests to `http://localhost:3000/api/chat` with the appropriate JSON body.


