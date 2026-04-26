import { dbService } from "./db";

export function handleRequest(req, res) {
  // Taking unvalidated input directly from the user
  const userId = req.body.userId; 
  
  // Passing the tainted data to another file
  dbService.queryData(userId);
}
