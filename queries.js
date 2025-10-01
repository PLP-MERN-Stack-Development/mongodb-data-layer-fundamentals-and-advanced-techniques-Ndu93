const mongoose = require("mongoose");

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

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://MERN_STACK:Ndubueze@cluster0.0kllwd9.mongodb.net/plp_bookstore?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Insert books into database
async function insertBooks() {
  try {
    // Clear existing books to avoid duplicates
    await Book.deleteMany({});

    // Insert all books
    await Book.insertMany(books);
    console.log("Books inserted successfully");
  } catch (error) {
    console.error("Error inserting books:", error);
  }
}

// Run all queries
async function runQueries() {
  await connectDB();
  await insertBooks();

  try {
    const books = await Book.find(
      {
        in_stock: true,
        published_year: { $gt: 2010 },
      },
      "title author price"
    );
    console.log(books);

    // Check books published after 2010
    const recentBooks = await Book.find({ published_year: { $gt: 2010 } });
    console.log("Books after 2010:", recentBooks);

    const booksAsc = await Book.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      "title author price"
    ).sort({ price: 1 });
    console.log(booksAsc);

    const booksDesc = await Book.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      "title author price"
    ).sort({ price: -1 });

    const page1 = await Book.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      "title author price"
    )
      .sort({ price: 1 })
      .limit(5)
      .skip(0);

    const page2 = await Book.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      "title author price"
    )
      .sort({ price: 1 })
      .limit(5)
      .skip(5);

    // AGGREGATION PIPELINE QUERIES

    console.log("\n=== 1. Average Price by Genre ===");
    const avgPriceByGenre = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" },
          bookCount: { $sum: 1 },
        },
      },
      {
        $sort: { averagePrice: -1 },
      },
      {
        $project: {
          genre: "$_id",
          averagePrice: { $round: ["$averagePrice", 2] }, // Round to 2 decimal places
          bookCount: 1,
          _id: 0,
        },
      },
    ]);
    console.log("Average price by genre:");
    console.log(avgPriceByGenre);

    console.log("\n=== 2. Author with Most Books ===");
    const authorWithMostBooks = await Book.aggregate([
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 },
          books: { $push: "$title" },
        },
      },
      {
        $sort: { bookCount: -1 },
      },
      {
        $limit: 3, // Get top 3 authors
      },
      {
        $project: {
          author: "$_id",
          bookCount: 1,
          books: 1,
          _id: 0,
        },
      },
    ]);
    console.log("Top authors by book count:");
    console.log(authorWithMostBooks);

    console.log("\n=== 3. Books by Publication Decade ===");
    const booksByDecade = await Book.aggregate([
      {
        $addFields: {
          decade: {
            $subtract: ["$published_year", { $mod: ["$published_year", 10] }],
          },
        },
      },
      {
        $group: {
          _id: "$decade",
          bookCount: { $sum: 1 },
          books: { $push: { title: "$title", year: "$published_year" } },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by decade ascending
      },
      {
        $project: {
          decade: "$_id",
          bookCount: 1,
          books: 1,
          _id: 0,
        },
      },
    ]);
    console.log("Books grouped by publication decade:");
    console.log(booksByDecade);

    //5
    // INDEXING QUERIES
    console.log("\n=== INDEXING QUERIES ===");

    // 1. Create an index on the title field for faster searches
    console.log("\n1. Creating index on title field...");
    await Book.collection.createIndex({ title: 1 });
    console.log("✓ Index created on title field");

    // 2. Create a compound index on author and published_year
    console.log("\n2. Creating compound index on author and published_year...");
    await Book.collection.createIndex({ author: 1, published_year: -1 });
    console.log("✓ Compound index created on author and published_year");

    // 3. Use the explain() method to demonstrate performance improvement
    console.log("\n3. Performance demonstration with explain():");

    console.log("\n--- Title Search with Index ---");
    const titleSearch = await Book.find({ title: "1984" }).explain(
      "executionStats"
    );
    console.log("Execution Stats:");
    console.log(
      `- Execution time: ${titleSearch.executionStats.executionTimeMillis} ms`
    );
    console.log(
      `- Documents examined: ${titleSearch.executionStats.totalDocsExamined}`
    );
    console.log(
      `- Index used: ${
        titleSearch.executionStats.executionStages.inputStage?.indexName ||
        "Collection scan"
      }`
    );

    console.log("\n--- Author + Year Search with Compound Index ---");
    const authorYearSearch = await Book.find({
      author: "George Orwell",
      published_year: { $gte: 1940 },
    }).explain("executionStats");
    console.log("Execution Stats:");
    console.log(
      `- Execution time: ${authorYearSearch.executionStats.executionTimeMillis} ms`
    );
    console.log(
      `- Documents examined: ${authorYearSearch.executionStats.totalDocsExamined}`
    );
    console.log(
      `- Index used: ${
        authorYearSearch.executionStats.executionStages.inputStage?.indexName ||
        "Collection scan"
      }`
    );

    console.log("\n--- Multiple Title Searches ---");
    const titles = ["The Hobbit", "Pride and Prejudice", "Moby Dick"];
    for (const title of titles) {
      const search = await Book.find({ title }).explain("executionStats");
      console.log(
        `"${title}": ${
          search.executionStats.totalDocsExamined
        } docs examined, index: ${
          search.executionStats.executionStages.inputStage?.indexName || "none"
        }`
      );
    }

    // Display all indexes
    console.log("\n4. Current indexes in the collection:");
    const indexes = await Book.collection.getIndexes();
    Object.keys(indexes).forEach((indexName) => {
      if (indexName !== "_id_") {
        console.log(`- ${indexName}:`, indexes[indexName].key);
      }
    });
  } catch (error) {
    //error catch
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
runQueries();
