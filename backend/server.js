import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import restaurantsRouter from './routes/restaurants.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount API routes
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: "Zomato Clone API Server is running!" });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Zomato Clone API Server listening on port ${PORT}`);
});
