import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, '../data/orders.json');

const router = express.Router();

const readOrders = () => {
  if (!fs.existsSync(ordersFilePath)) return [];
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
};

// POST /api/orders -> save order to orders.json with userId, items, total, status: "Placed", timestamp
router.post('/', authMiddleware, (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.userId; // Set by authMiddleware

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (total === undefined || total === null) {
      return res.status(400).json({ message: "Order total is required" });
    }

    const orders = readOrders();
    const newOrder = {
      id: 'ord_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId,
      items,
      total,
      status: "Placed",
      timestamp: new Date().toISOString()
    };

    orders.push(newOrder);
    writeOrders(orders);

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal server error while placing order" });
  }
});

// GET /api/orders/:userId -> return orders for that user
router.get('/:userId', authMiddleware, (req, res) => {
  try {
    const { userId } = req.params;

    // Simple permission check: verify request user matches URL params user
    if (req.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to access other user's orders" });
    }

    const orders = readOrders();
    const userOrders = orders.filter(o => o.userId === userId);

    return res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal server error while fetching orders" });
  }
});

export default router;
