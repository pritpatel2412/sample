import { dbService } from "./db";
import { validationResult, check } from "express-validator";

export function handleRequest(req, res) {
  // Validate and sanitize userId input
  check('userId').isInt().trim().escape().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.body.userId;

  // Use parameterized queries to mitigate SQL injection risk
  dbService.queryData(userId);
}