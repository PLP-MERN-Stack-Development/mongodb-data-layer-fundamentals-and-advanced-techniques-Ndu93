// insert_books.js - Script to populate MongoDB with sample book data

const { connectDB, mongoose } = require("./db");

// Import MongoDB client
const { MongoClient } = require("mongodb");

// Connection URI (MongoDB connection string for Atlas or local)
const uri =
  "mongodb+srv://MERN_STACK:Ndubueze@cluster0.0kllwd9.mongodb.net/plp_bookstore?retryWrites=true&w=majority&appName=Cluster0";

// Database and collection names
const dbName = "plp_bookstore";
const collectionName = "books";

// Sample book data
const books = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: "J. B. Lippincott & Co.",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    published_year: 2025,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: "Secker & Warburg",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: "Charles Scribner's Sons",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian",
    published_year: 1932,
    price: 11.5,
    in_stock: false,
    pages: 311,
    publisher: "Chatto & Windus",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: "George Allen & Unwin",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: "Little, Brown and Company",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: "T. Egerton, Whitehall",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: "Allen & Unwin",
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Political Satire",
    published_year: 1945,
    price: 8.5,
    in_stock: false,
    pages: 112,
    publisher: "Secker & Warburg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: "HarperOne",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    genre: "Adventure",
    published_year: 1851,
    price: 12.5,
    in_stock: false,
    pages: 635,
    publisher: "Harper & Brothers",
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    genre: "Gothic Fiction",
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: "Thomas Cautley Newby",
  },
];

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  published_year: Number,
  price: Number,
  in_stock: Boolean,
  pages: Number,
  publisher: String,
});

const Book = mongoose.model("Book", bookSchema);

// Function to insert books into MongoDB
async function insertBooks() {
  await connectDB();
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if collection already has documents
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(
        `Collection already contains ${count} documents. Dropping collection...`
      );
      await collection.drop();
      console.log("Collection dropped successfully");
    }

    // Insert the books
    const result = await collection.insertMany(books);
    console.log(
      `${result.insertedCount} books were successfully inserted into the database`
    );

    // 1. Find all books in a specific genre
    console.log("1. Fiction books:");
    const fictionBooks = await Book.find({ genre: "Fiction" });
    console.log(fictionBooks);

    // 2. Find books published after a certain year
    console.log("\n2. Books published after 2020:");
    const recentBooks = await Book.find({ publicationYear: { $gt: 2020 } });
    console.log(recentBooks);

    // 3. Find books by a specific author
    console.log("\n3. Books by specific author:");
    const authorBooks = await Book.find({ author: "J.K. Rowling" });
    console.log(authorBooks);

    // 4. Update the price of a specific book
    console.log("\n4. Updating book price:");
    const updatedBook = await Book.findOneAndUpdate(
      { title: "The Great Gatsby" },
      { $set: { price: 29.99 } },
      { new: true }
    );
    console.log("Updated book:", updatedBook);

    // 5. Delete a book by its title
    console.log("\n5. Deleting book:");
    const deletedBook = await Book.findOneAndDelete({
      title: "To Kill a Mockingbird",
    });
    console.log("Deleted book:", deletedBook);

    // Display the inserted books
    console.log("\nInserted books:");
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(
        `${index + 1}. "${book.title}" by ${book.author} (${
          book.published_year
        })`
      );
    });
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

// Run the function
insertBooks().catch(console.error);

/*
 *MongoDB queries Using MongoDB shell:
 *
 * 1. Find all books:
 *    db.books.find({ genre: "Fiction" })
 *
 * 2. Find books by a specific author:
 *    db.books.find({ author: "J.K. Rowling" })
 *
 * 3. Find books published after 1950:
 *    db.books.find({ publicationYear: { $gt: 1950 } })
 *
 * 4. Find books in a specific price:
 *   db.books.updateOne(
    { title: "The Great Gatsby" },
    { $set: { price: 29.99 } }
)
 *
 * 5. delete a book by its title:
 *    db.books.deleteOne({ title: "The Catcher in the Rye" })
 */
