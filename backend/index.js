require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const router = require("./routes/index");
const app = express();
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

console.log("=== ENV VARIABLES CHECK ===");
console.log("PORT:", process.env.PORT);
console.log("SECRET_KEY exists:", !!process.env.JWT_SECRET);
console.log(
  "SECRET_KEY value (first 5 chars):",
  process.env.JWT_SECRET?.substring(0, 5),
);
console.log("DB_USER:", process.env.DB_USER);
console.log("=====================");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Server started on PORT ${PORT}`,
  });
});

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
