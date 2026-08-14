// imports
const { response, json } = require('express');
const express = require('express');
const request = require('request');
const wikip = require('wiki-infobox-parser');
const dotenv = require('dotenv')
const axios = require('axios');

//Initializing Express for creating Server
const app = express();
//Configuring env
dotenv.config();
//Static Resources 
app.use("/static", express.static(__dirname + "/static/"));
//Setting up the View Engine
app.set("view engine", 'ejs');

//Dashboard route here
app.get("/", (req, res) => {
  res.render("dashboard");
});
//Nasa route here
app.get("/nasa", (req, res) => {
  (async () => {
    try {
      const url =
        "https://api.nasa.gov/planetary/apod?api_key=" + process.env.api_key;
      const response = await axios.get(url);
      res.render("nasa.ejs", { data: response.data });
    } catch (error) {
      console.log(error.response?.data || error.message);
      res.status(500).send("NASA API error — check your api_key in .env");
    }
  })();
});
//Search route here
app.get("/search", (req, response) => {
  if (!req.query.person) {
    response.render("search");
    return;
  }

  let url = "https://en.wikipedia.org/w/api.php";

  const params = {
    action: "opensearch",
    search: req.query.person,
    limit: "1",
    namespace: "0",
    format: "json",
  };

  url = url + "?";

  Object.keys(params).forEach((key) => {
    url += "&" + key + "=" + params[key];
  });

  request(url, (err, res, body) => {
    if (err) {
      response.redirect("/404");
      return;
    }

    const result = JSON.parse(body);
    let x = result[3][0];

    x = x.substring(30, x.length);

    wikip(x, (err, final) => {
      if (err) {
        response.redirect("/404");
      } else {
        const data = JSON.parse(final);
        data["person"] = req.query.person;

        response.render("details", { data: data });
      }
    });
  });
});
//Starting the server
app.listen(6004, console.log("Listening at port 6004..."));
