import app from "./app.js";

const PORT = 5000;

// On your computer the API runs as its own server. Online, Vercel runs app.js for us.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});