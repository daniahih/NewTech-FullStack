const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
};

module.exports = { notFoundHandler, errorHandler };
