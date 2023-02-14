import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql";
import bodyParser from 'body-parser'
import cors from 'cors'
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(cors());

//db connection
const dbConnection = mysql.createConnection(
  {
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
  },
  console.log("db connected")
);


app.get("/", (req, res) => {
  res.json("hello this is from server");
});

//route get all books
app.get("/books", (req, res) => {
  const query = "SELECT * FROM books";
  dbConnection.query(query, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

//add book route
app.post("/books", (req, res) => {
    const query = "INSERT INTO books(`title`, `description`,`price` ,`author`) VALUES (?)";
    const values = [
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.author,
    ];
    dbConnection.query(query, [values], (err, data) => {
      if (err) return res.send(err);
      return res.json("Book added successfully");
    });
  });

//delete route
app.delete('/books/:id',(req,res) => {
  const bookId = req.params.id;
  const query = "DELETE FROM books WHERE id = ?"

  dbConnection.query(query,[bookId], (err,data) => {
    if(err) return req.json(err);
    return res.json("Book has been deleted successfully")
  });
});

//update route
app.put('/books/:id', (req,res) => {
  const bookId = req.params.id;
  const query = "UPDATE books SET `title` = ?, `description` = ?, `price` = ?, `author` = ? WHERE id = ? " ;
  const values= [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.author,
  ]
  dbConnection.query(query,[...values, bookId], (err,data) => {
    if(err) return req.json(err);
    return res.json("Book has been updated successfully")
  });
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
