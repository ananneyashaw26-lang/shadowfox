import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

const router = express.Router();

const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// POST /api/auth/register -> save user to users.json, return a fake token (user id as a string)
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) are required" });
    }

    const users = readUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User with this email already registered" });
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name,
      email,
      password // storing plain password for this beginner setup
    };

    users.push(newUser);
    writeUsers(users);

    // Return fake token (the user id as a string) and user metadata
    return res.status(201).json({
      token: newUser.id,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Register route error:", error);
    return res.status(500).json({ message: "Internal server error during registration" });
  }
});

// POST /api/auth/login -> check credentials in users.json, return same fake token
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login route error:", error);
    return res.status(500).json({ message: "Internal server error during login" });
  }
});

export default router;
