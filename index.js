require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const authField = "_:" + process.env.API_KEY;
  const url = "https://us21.api.mailchimp.com/3.0/lists/c74cbb65d7";
  const options = {
    method: "POST",
    auth: authField,
  };
  const request = https.request(url, options, function (response) {
    // console.log("REsponse");
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server running at port 3000");
});

//API key
//c6667fa51e2ed39fade4b499504fb9b8-us21

//List ID
//c74cbb65d7
