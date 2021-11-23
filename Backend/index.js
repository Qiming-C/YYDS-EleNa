const express = require("express");
const app = express();
const port = 3000;
const mapRouter = require("./map/mapController");
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: '*'
}));


app.use("/api/map/", mapRouter);

app.get("/", (req, res) => {
  res.send("this is yyds");
});

app.listen(port, async () => {
  console.log("server is up running");
});
