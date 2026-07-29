# Personal Expense Tracker

A full stack web app where you can create an account, log in, add expenses, and see your running total. Built while learning Node.js and Express — no frameworks on the frontend, just HTML, CSS and vanilla JavaScript.

## Features

- **Sign up / Sign in** with username and password
- **JWT authentication** — after signing in, a token is stored in the browser and sent with every request
- **Add expenses** with an item name and amount
- **See your total** — each user only ever sees their own expenses
- **Clean, responsive UI** styled with plain CSS (flexbox for layout)

## Tech Stack

| Layer | Used |
|---|---|
| Backend | Node.js, Express |
| Auth | jsonwebtoken (JWT) |
| Frontend | HTML, CSS, vanilla JavaScript |
| HTTP requests | Axios |
| Storage | In-memory arrays |

## Running it locally

```bash
git clone https://github.com/YOUR-USERNAME/personal-expense-tracker.git
cd personal-expense-tracker
npm install
npm start
```

Then open <http://localhost:3001/signup> in your browser.

## How it works

**1. Signing up** — `POST /signup` checks whether the username is already taken, then adds the user to the `Users` array.

**2. Signing in** — `POST /signin` finds a matching username and password, then creates a JWT with `jwt.sign()` and sends it back. The frontend saves it with `localStorage.setItem("token", token)`.

**3. Protected routes** — `POST /expense` and `GET /expense` both read the token from the request headers and run `jwt.verify()` to work out which user is making the request. No valid token means a `403` response.

**4. Totals** — `GET /expense` filters the `Expenses` array down to the logged-in user's entries and adds up the amounts, so you only ever see your own spending.

## Known limitations

This is a learning project, so a few things are deliberately simple. If I took it further, these are what I'd fix first:

- **Data is stored in memory.** Everything lives in JavaScript arrays, so it's all lost when the server restarts. Next step: a real database like PostgreSQL or MongoDB.
- **Passwords are stored as plain text.** They should be hashed with bcrypt before being saved.
- **The JWT secret is hardcoded** in `personal.js`. It should be loaded from an environment variable via `process.env` and kept out of the repo.
- **No error handling on the frontend.** If a request fails, nothing is shown to the user yet.
- **No input validation.** Empty usernames and non-numeric amounts are currently accepted.

## What I learned

- How to build REST API routes with Express and handle JSON request bodies
- How JWT authentication actually works end to end — creating a token on login, storing it in `localStorage`, sending it in request headers, and verifying it on protected routes
- How to connect a frontend to a backend with Axios
- CSS layout with flexbox, and why inline styles override stylesheet rules
