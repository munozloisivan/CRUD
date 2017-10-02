var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://localhost:27017/pruebaMongo';

router.get('/hellodb', function(req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        res.send("Hello, you're connnected to database");
        db.close();
    });
});

router.get('/createcollection', function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        db.createCollection("user", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
    res.send("Collection created! web");
});

router.get('/users/insert', function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var myobj = { name: "Mariona", lastName: "Rovira Caliz", telephones:{home:934299755,mobile:686360640} };
        db.collection("user").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.send("Introducido correctamente");
});


/* To select data from a collection in MongoDB, we can use the findOne() method.
The findOne() method returns the first occurrence in the selection.*/
router.get('/users/findone', function (req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        db.collection("user").findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result.name);
            res.send("El usuario encontrado es: " + result.name);
            db.close();
        });
    });
});

/* Find All
*  The find() method returns all occurrences in the selection.
* */
router.get('/users/findall', function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        db.collection("user").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});

/* Find some QUERY
* The second parameter of the find() method is an object describing which fields to include in the result.
This parameter is optional, and if omitted, all fields will be included in the result.
* */

router.get('/users/findfilter', function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var query = {lastName: "Muñoz Lois"};
        db.collection("user").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});

/* SORT
* */
router.get('/users/sort', function (req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        //Sort the result by name:
        var sort = { name: 1 };
            //name: 1 -- sort ascending
            //name: 0 -- sort descending
        db.collection("user").find().sort(sort).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});

/*
* DELETE one
* */
router.get('/users/deleteone', function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var myquery = { name: 'Mariona' };
        db.collection("user").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.send("1 document deleted");
            db.close();
        });
    });
});

/*DELETE MANY
 *  */
router.get('/users/deletemany', function (req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var myquery = { lastName: /^T/ }; //todos los que empiezan por la letra T
        db.collection("user").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
});

/*
Update Document
If the query finds more than one record, only the first occurrence is updated.
*/
router.get('/users/updateone',function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var myquery = { name: "Mariona" };
        var newvalues = { name: "Marionsita independence", lastName: "Rovira Caliz", telephones:{home:934299755,mobile:686360640}};
        db.collection("user").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
        res.send("1 document updated");
    });
});

/* update specidic fields
* */
router.get('/users/updateespecific',function (req,res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var myquery = { name: "Mariona" };
        var newvalues = { $set: { name: "Marionsita" } };
        db.collection("user").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
        res.send("1 document updated");
    });
});



/*
router.get('/users/:user', function(req, res) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;

        db.collection("users").findOne({"name":req.params.user}, function(err, result) {
            if (err) throw err;
            else res.json({ "id":result._id, "name" : result.name, "second name":result.secondName});
            db.close();
        });
    });
});
*/
module.exports = router;