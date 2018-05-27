const path = require('path');
var express = require('express');
var app = express();
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "192.168.0.16",
  user: "root",
  password: "db123!",
  database: "places"
});

db.connect(function(err) {
  if (err) {
    console.error("failed to connect");
    throw err;
  }
  console.log("Connected!");



  app.get('/', function (req, res) {
    res.send('Hello World!');
  });


  app.get('/rooms', function (req, res) {
    const category = req.query.category;
    if (!category) {
      res.status(400).send("category missing");
      return;
    }

    db.query(`
      SELECT *
      FROM Rooms
      WHERE category = ?
    `, [category], function (err, result) {
      if (err) {
        res.status(500).send("database error");
        console.warn(err);
        return
      }

      res.json(result);
    });
  });

  app.get('/room', function (req, res) {
    const id = req.query.id;
    if (!id) {
      res.status(400).send("id missing");
      return;
    }

    db.query(`
      SELECT *
      FROM Rooms
      WHERE room_id = ?
      LIMIT 1
    `, [id], function (err, result) {
      if (err) {
        res.status(500).send("database error");
        console.warn(err);
        return
      }

      res.json(result[0]);
    });
  });


  app.get('/categories', function (req, res) {
    db.query(`
      SELECT DISTINCT category
      FROM Rooms
    `, function (err, result) {
      if (err) {
        res.status(500).send("database error");
        console.warn(err);
        return;
      }

      res.json(
        result .map(row => row.category)
      );
    });
  });


  app.get('/map', function (req, res) {
    const from = req.query.from;
    const to = req.query.to;
    if (!from) {
      res.status(400).send("from missing");
      return;
    } else if (!to) {
      res.status(400).send("to missing");
      return;
    }

    res.sendFile("dummy-map.png", {root: __dirname});


  });


  app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });

});
