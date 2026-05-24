import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const restaurantsFilePath = path.join(__dirname, '../data/restaurants.json');

const router = express.Router();

// GET /api/restaurants -> Return all restaurants
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(restaurantsFilePath)) {
      return res.status(404).json({ message: "Restaurants database not found" });
    }
    const restaurants = JSON.parse(fs.readFileSync(restaurantsFilePath, 'utf-8'));
    res.json(restaurants);
  } catch (error) {
    console.error("Error reading restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/restaurants/:id -> Return a single restaurant with its menu
router.get('/:id', (req, res) => {
  try {
    if (!fs.existsSync(restaurantsFilePath)) {
      return res.status(404).json({ message: "Restaurants database not found" });
    }
    const restaurants = JSON.parse(fs.readFileSync(restaurantsFilePath, 'utf-8'));
    const restaurant = restaurants.find(r => r.id === req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error reading restaurant by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
