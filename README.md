# Harbor Support: AI Customer Support Web App

A full-stack customer support app. Customers chat on a React website, and an n8n workflow classifies each message with an LLM, creates tickets for urgent issues, and sends a reply back to the chat.

## How it works

```
React chat page
      |  POST /webhook/support-chat  { message, sessionId, userEmail }
      v
n8n workflow
  Webhook -> LLM classifier (Gemini) -> Code (parse JSON) -> Respond to Webhook
                                              |
                                              +-> Supabase (tickets table)
      |
      v  { reply, intent, urgency, escalated, ticketId }
React chat page (shows intent and ticket badges)
```

## Features

- Chat page with session tracking, typing indicator and error handling
- Message classification by intent (billing, bug, account, shipping, faq, complaint, other) and urgency (low, medium, high)
- Fallback when the AI returns malformed JSON, so the chat never breaks
- Ticket rows saved in Supabase (PostgreSQL)
- Badges in the chat for intent, urgent messages and created tickets
- Mock replies when no webhook URL is set, so the frontend runs on its own

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, CSS |
| Automation | n8n |
| AI | Google Gemini |
| Database | Supabase (PostgreSQL) |

## API contract

Request:
```json
{ "message": "How can I get a refund?", "sessionId": "abc123", "userEmail": "user@mail.com" }
```

Response:
```json
{ "reply": "...", "intent": "billing", "urgency": "low", "escalated": false, "ticketId": null }
```

## Run it locally

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set your n8n webhook URL:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-host/webhook/support-chat
   ```
   Leave it empty to use built-in mock replies.
3. Start the app:
   ```
   npm run dev
   ```

## Set up the backend

1. Create a Supabase project and run the SQL in `supabase/schema.sql`.
2. Import `n8n/workflow.json` into n8n.
3. Add your own credentials in n8n: a Gemini API key and a Supabase service role key.
4. Publish the workflow and use its Production URL in `.env`.

Keep API keys inside n8n. Never put them in the React app or commit them to this repo.

## Roadmap

- [ ] Route messages with an IF/Switch node so only urgent issues, bugs and complaints create tickets
- [ ] FAQ answers from a knowledge base (RAG with a Supabase vector store)
- [ ] FAQ page and My Tickets page reading from Supabase
- [ ] Admin dashboard with ticket and intent charts
- [ ] Chat logging table and error-alert workflow

## Screenshots

Add screenshots of the chat page, the n8n workflow canvas and the Supabase tickets table here.