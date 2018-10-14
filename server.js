var express = require("express");
var mongoose = require("mongoose");

// As explained in class: Axios is a client/server promised-based http library, similar to jQuery's Ajax method
var axios = require("axios");
var cheerio = require("cheerio");

var uri = 'mongodb://heroku_h636hjjs:ko27n1vut7qd4qnfcmdh8van01@ds223653.mlab.com:23653/heroku_h636hjjs'

// Models
var db = require("./models");

// PORT 3000 as is tradition
var PORT = proces.env.PORT || 3000;

// Initialize Express
var app = express();

// Turn req body into JSON!
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// (Make public a static folder) - one from class. Will study more.
app.use(express.static("public"));

// Mongo DB connection per homework requirements. Good practice!
var MONGODB_URI =
  uri || "mongodb://localhost/mongoscraperign";
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Use this GET to "Scrape" sites
app.get("/scrape", function(req, res) {
  // Axios reaches into the HTML to grab the text we want
  axios.get("http://www.ign.com/articles?tags=news").then(function(response) {
    // Use a $ (to more or less conincide with our jQuery learning) to assign the cheerio method of loading the data
    var $ = cheerio.load(response.data);
    //console.log(response.data);
    // Now grab every div from IGN about new Gaming posts
    $(".listElmnt-blogItem").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the title, text, and href of every link, as properties of the result
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("p")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
    //console.log(res);
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/notes", function(req, res) {
  // Grab every document in the Notes collection
  db.Note.find({})
    .then(function(dbNote) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Delete One Article from the DB
app.delete("/delete/article/:id", function(req, res) {
  // Remove a note using the objectID
  db.Article.findOneAndDelete(
    {
      _id: req.params.id
    },
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

app.delete("/delete/note/:id", function(req, res) {
  // Remove a note using the objectID
  db.Note.findOneAndDelete(
    {
      _id: req.params.id
    },
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

// Delete ALL Articles from the DB
app.delete("/refresh/", function(req, res) {
  // Remove a note using the objectID
  db.Article.deleteMany({}, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(removed);
      res.send(removed);
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
