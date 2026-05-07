# 🍸 Sipcraft — Cocktail Explorer

A Node.js/Express web app that pulls cocktail recipes from the free [TheCocktailDB API](https://www.thecocktaildb.com/api.php) and presents them in a clean, editorial UI.

## Features
- Random cocktail on every page load
- Search by cocktail name
- Browse by category (Cocktail, Shot, Punch, Liqueur)
- Ingredient list with measures
- Step-by-step instructions
- Press `/` to focus the search bar

## Tech Stack
- **Express.js** — web server & routing
- **Axios** — HTTP requests to the API
- **EJS** — server-side HTML templating
- **TheCocktailDB** — free, no-auth public API

## Setup

```bash
npm install
npm start
```

Then open http://localhost:3000

## Project Structure

```
cocktail-explorer/
├── index.js          ← Express server + routes
├── views/
│   └── index.ejs     ← EJS template
└── public/
    ├── css/style.css
    └── js/main.js
```

## API Endpoints Used
| Route | API call |
|---|---|
| `GET /` | `/random.php` |
| `GET /search?q=` | `/search.php?s=` |
| `GET /random` | `/random.php` |
| `GET /category/:name` | `/filter.php?c=` + `/lookup.php?i=` |
