const logger = (req, res, next) => {
  const date = new Date().toISOString().replace("T", " ").split(".")[0]; // Format datum i vrijeme
  const method = req.method;
  const url = req.originalUrl;

  // Format: [movie-server] [datum] METODA URL
  console.log(`[movie-server] [${date}] ${method} ${url}`);
  next();
};

export default logger;
