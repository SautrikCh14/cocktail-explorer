// Main server file for Cocktail Explorer
// Uses Express + Axios to talk to TheCocktailDB API

import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

// The free CocktailDB API base URL (no auth needed)
const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Serve static files (CSS, JS, images) from the public folder
app.use(express.static("public"));

// Parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

//  HOME ROUTE 
// Shows a random cocktail on page load
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/random.php`);
    const cocktail = response.data.drinks[0];

    // Build ingredient list (the API gives up to 15 ingredient slots)
    const ingredients = buildIngredients(cocktail);

    res.render("index", {
      cocktail,
      ingredients,
      searchQuery: "",
      error: null,
    });
  } catch (err) {
    console.error("Failed to load random cocktail:", err.message);
    res.render("index", {
      cocktail: null,
      ingredients: [],
      searchQuery: "",
      error: "Couldn't load a cocktail right now. Please try again.",
    });
  }
});

// ─── SEARCH ROUTE ──────
// Searches cocktails by name and shows the first result
app.get("/search", async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.redirect("/");
  }

  try {
    const response = await axios.get(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    const drinks = response.data.drinks;

    if (!drinks) {
      // No results found — render with a friendly message
      return res.render("index", {
        cocktail: null,
        ingredients: [],
        searchQuery: query,
        error: `No cocktails found for "${query}". Try something else!`,
      });
    }

    // Show the first match
    const cocktail = drinks[0];
    const ingredients = buildIngredients(cocktail);

    res.render("index", {
      cocktail,
      ingredients,
      searchQuery: query,
      error: null,
    });
  } catch (err) {
    console.error("Search failed:", err.message);
    res.render("index", {
      cocktail: null,
      ingredients: [],
      searchQuery: query,
      error: "Search failed. Please try again.",
    });
  }
});

// ─── RANDOM ROUTE ────────────────────────────────────────────────────────────
// Just fetches a new random cocktail (used by the "Surprise Me" button)
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/random.php`);
    const cocktail = response.data.drinks[0];
    const ingredients = buildIngredients(cocktail);

    res.render("index", {
      cocktail,
      ingredients,
      searchQuery: "",
      error: null,
    });
  } catch (err) {
    console.error("Random cocktail fetch failed:", err.message);
    res.redirect("/");
  }
});

// CATEGORY ROUTE 
// Filters cocktails by category (Cocktail, Shot, Punch, etc.)
app.get("/category/:name", async (req, res) => {
  const category = req.params.name;

  try {
    // This endpoint lists drinks in a category
    const listRes = await axios.get(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const drinks = listRes.data.drinks;

    if (!drinks) {
      return res.redirect("/");
    }

    // Pick a random one from the category list and fetch its full details
    const randomPick = drinks[Math.floor(Math.random() * drinks.length)];
    const detailRes = await axios.get(`${API_BASE}/lookup.php?i=${randomPick.idDrink}`);
    const cocktail = detailRes.data.drinks[0];
    const ingredients = buildIngredients(cocktail);

    res.render("index", {
      cocktail,
      ingredients,
      searchQuery: "",
      error: null,
    });
  } catch (err) {
    console.error("Category fetch failed:", err.message);
    res.redirect("/");
  }
});

// ─── HELPER: BUILD INGREDIENTS ARRAY ────────
// The CocktailDB API stores ingredients as strIngredient1...strIngredient15
// and measures as strMeasure1...strMeasure15. This collapses them into
// a clean array like [{ name: "Gin", measure: "2 oz" }, ...]
function buildIngredients(cocktail) {
  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const name = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    // Stop once we hit empty slots
    if (!name) break;

    ingredients.push({
      name: name.trim(),
      measure: measure ? measure.trim() : "to taste",
    });
  }

  return ingredients;
}

// ─── START SERVER ─────────
app.listen(PORT, () => {
  console.log(`🍹 Cocktail Explorer running at http://localhost:${PORT}`);
});
