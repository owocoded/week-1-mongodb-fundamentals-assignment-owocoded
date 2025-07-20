//Find all books in a specific genre (e.g., "Fiction"):
db.books.find({ genre: "Fiction" })

//Find books published after a certain year (e.g., after 1950):
db.books.find({ publishedYear: { $gt: 1950 } })

//Find books by a specific author(e.g., "George Orwell"):
db.books.find({ author: "George Orwell" })

//Update the price of a specific book(e.g., "1984" to 15.99):
db.books.updateOne({ title: "1984" }, { $set: { price: 15.99 } })

//Delete a book by its title(e.g., "The Hobbit"):
db.books.deleteOne({ title: "The Hobbit" })

// Find books that are both in stock and published after 2010, projecting only title, author, and price
// Projection: { title: 1, author: 1, price: 1, _id: 0 }
db.books.find(
    { in_stock: true, published_year: { $gt: 2010 } },
    { title: 1, author: 1, price: 1, _id: 0 }
)

// Sort books by price ascending (projection: title, author, price)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: 1 })

// Sort books by price descending (projection: title, author, price)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: -1 })

// Pagination: 5 books per page (e.g., page 2: skip first 5, limit next 5)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).skip(5).limit(5)

// Aggregation pipeline: Calculate the average price of books by genre
// Returns: genre and averagePrice

db.books.aggregate([
    { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
])

// Aggregation pipeline: Find the author with the most books in the collection
// Returns: author and bookCount, sorted descending, limit 1

db.books.aggregate([
    { $group: { _id: "$author", bookCount: { $sum: 1 } } },
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
])

// Aggregation pipeline: Group books by publication decade and count them
// Returns: decade and count

db.books.aggregate([
    { $project: { decade: { $concat: [{ $toString: { $subtract: [{ $divide: ["$published_year", 10] }, { $mod: ["$published_year", 10] }] } }, "s"] } } },
    { $group: { _id: "$decade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
])

// Create an index on the title field for faster searches
// In MongoDB shell:
db.books.createIndex({ title: 1 })

// Create a compound index on author and published_year
// In MongoDB shell:
db.books.createIndex({ author: 1, published_year: 1 })

// Use explain() to demonstrate performance improvement with indexes
// Example: Find by title with explain

db.books.find({ title: "1984" }).explain("executionStats")

// Example: Find by author and published_year with explain

db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats")