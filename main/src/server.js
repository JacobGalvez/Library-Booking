const express = require('express');
const {MongoClient} = require('mongodb');
let cs = "mongodb+srv://John:Pass@cluster0.8d0rnkm.mongodb.net/?retryWrites=true&w=majority"
let db;
let books;
async function start() {
  try {
      const client = new MongoClient(cs, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });

      await client.connect();

      db = client.db("DB1");
      books = db.collection("books");
      
      console.log("Connected to MongoDB");
      
      app.listen(3000, () => {
          console.log("Listening on port 3000");
      });
  } catch (error) {
      console.error("Error starting server:", error);
  }
}
var app = express();

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
     'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
    });

app.use(express.json());    // <==== parse request body as JSON

app.get('/books/:id', (req,res) => {
  books.findOne( { id:req.params.id }  )
  .then(  (book) => {
     if (book == null)
     res.status(404).send("not found")
     else res.send(JSON.stringify(book))
  }      )
 })
 //app.get('/books/:id', getone)
//async function getone(req,res) {
//  var book = await books.findOne( { id:req.params.id});
//  res.send(JSON.stringify(book));
//}
app.get('/books', async (req, res) => {
    try {
        const { avail } = req.query;
        let query = {};

        if (avail === 'true') {
            query.avail = true;
        } else if (avail === 'false') {
            query.avail = false;
        } else {
            // If avail is neither 'true' nor 'false', or not provided,
            // only project certain fields
            const allbooks = await books.find().project({ _id: 0, id: 1, title: 1 }).toArray();
            return res.send(allbooks);
        }

        const result = await books.find(query).toArray();
        res.send(result);

    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Internal Server Error");
    }
});
 
app.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { avail, who, due } = req.body;

        const book = await books.findOne({ id: id });

        if (!book) {
            return res.status(404).send('ID does not exist');
        }

        const updatedBook = {
            ...book,
            avail: avail,
            who: who,
            due: due
        };

        await books.updateOne({ id: id }, { $set: updatedBook });

        res.send(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.delete('/books/:id', (req,res) => {
    const  book = books.find(b => b.id === parseInt(req.params.id));

    let temp = req.params.id;

    if (!book)
    {
        res.status(204).send('ID does not exist');
    }
    else
    {
        books.deleteOne({id: { $eq: req.params.id}});
            res.send(books)
            console.log(`Book with ID ${book.id} has been deleted...`);
    }
 });
app.post('/books', (req,res) => {const checkID = books.find(b => b.id === parseInt(req.body.id));

        var book = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            isbn: req.body.isbn,
            avail: req.body.avail,
            who: req.body.who,
            due: req.body.due
        };
        books.insertOne(book);
        res.status(201).send(book);
});
start();