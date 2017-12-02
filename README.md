## Instant runoff voting

### Installation

After cloning the repo:

```
npm install
npm run build
npm start
```

### The API
GET  /api/polls
POST /api/polls
DEL  /api/polls
GET  /api/polls/:poll_id
GET  /api/polls/:poll_id/results
GET  /api/polls/:poll_id/ballots
GET  /api/polls/:poll_id/ballots/:voter_id
POST /api/polls/:poll_id/ballots/:voter_id

