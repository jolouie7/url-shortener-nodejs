const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shortid = require("shortid");

const Url = require("./models/urls");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// setup mongodb connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// routes
app.get("/", async (req, res) => {
  //find all urls in the Url table in our db
  const urls = await Url.find()
  res.json(urls)
})

app.post("/url", async (req, res) => {
  //check if the longUrl is already in the db, if it is do something. If not create a new shortUrl
  // const url = await Url.find((url) => req.body.longUrl === url.longUrl);
  // if (url) {
  //   console.log("This url was already created")
  // } else {
    await Url.create({
      longUrl: req.body.longUrl,
      urlCode: shortid.generate(),
      shortUrl: "http://localhost:5000/",
    });
    res.redirect("/")
  // }
})

app.get("/:urlCode", async (req, res) => {
  // console.log(req)
  const url = await Url.findOne({ urlCode: req.params.urlCode })
  if (url) {
    return res.redirect(url.longUrl)
  } else {
    return res.status(404).json("No url found")
  }
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
