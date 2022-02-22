var express = require("express");
var router = express.Router();
var { dbUrl, mongodb, MongoClient, dbNAme } = require("../dbConfig");

//1.creating a room
router.post("/room", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);
    const result = await db.collection("room").insertOne(req.body);
    console.log(result);
    res.json({
      message: "room created",
    });
  } catch (error) {
    console.log(error);
  }
});

// 2.booking a room
router.post("/book/:id", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);

    const result1 = await db
      .collection("room")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    if (result1) {
      console.log("room available");
      const query1 = await db
        .collection("room")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: { customer_details: req.body } }
        );
      if (query1) {
        res.json({ message: "booked successfully" });
        await db
          .collection("room")
          .updateOne(
            { _id: mongodb.ObjectId(req.params.id) },
            { $set: { bookedstatus: "booked successfully" } }
          );
      }
    } else {
      console.log("room unavailable");
      res.json({
        message: "room unavailable",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//list all rooms with booked data
router.get("/rooms", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);

    const result1 = await db
      .collection("room")
      .findOne({
        roomname: data.roomname,
        bookedstatus: data.bookedstatus,
        customername: data.customer_details.customername,
        date: data.customer_details.date,
        start_time: data.customer_details.start - time,
        end_time: data.customer_details.end - time,
      });
    if (result1) {
      res.json({
        data: result1,
      });
    } else {
      console.log("invalid date");
    }
  } catch (error) {
    console.log(error);
  }
});
//4.list all customers with booked data
router.get("/customer/rooms", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbNAme);

    const result1 = await db
      .collection("room")
      .findOne({
        customername: data.customer_details.customername,
        roomname: data.roomname,
        date: data.customer_details.date,
        start_time: data.customer_details.start - time,
        end_time: data.customer_details.end - time,
      });
    if (result1) {
      res.json({
        data: result1,
      });
    } else {
      console.log("invalid date");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
