const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const { logRequest } = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS so the frontend can access this API from a different origin.
// Without this, browsers may block requests from the client app.
app.use(
  cors({
    // Allow requests from the frontend app
    origin: "http://localhost:5137",
    // Allow these HTTP methods from the client
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // Allow JSON content type in requests
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(logRequest);

app.use("/api/movies", movieRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Movie API running on http://localhost:${PORT}`);
});
