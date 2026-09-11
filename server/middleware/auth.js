import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    // If no JWT token is passed, allow fallback for development/demo user header or query
    const fallbackUserId = req.headers["x-user-id"] || req.query.userId;
    if (fallbackUserId) {
      const user = await User.findOne({
        $or: [
          { userId: fallbackUserId },
          { referralCode: fallbackUserId.toUpperCase() },
          { walletAddress: fallbackUserId.toLowerCase() }
        ]
      });
      if (user) {
        req.user = user;
        return next();
      }
    }
    return res.status(401).json({ success: false, error: "Access token required" });
  }

  try {
    const secret = process.env.JWT_SECRET || "regal_jwt_super_secret_production_key_2026_bsc_56";
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({ success: false, error: "User session not found" });
    }
    if (user.status === "Suspended") {
      return res.status(403).json({ success: false, error: "Account has been suspended" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
};
