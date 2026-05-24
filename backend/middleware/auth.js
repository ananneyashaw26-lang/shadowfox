import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    if (!fs.existsSync(usersFilePath)) {
      return res.status(501).json({ message: "Users database not initialized" });
    }
    
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    const user = users.find(u => u.id === token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = token;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
};
export default authMiddleware;
