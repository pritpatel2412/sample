export const dbService = {
  // Dangerous function that concatenates raw strings into a query
  queryData: function(userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    db.execute(query); 
  }
}
