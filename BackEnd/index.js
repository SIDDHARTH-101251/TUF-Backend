const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "database-1.clwesgwgsaq0.eu-north-1.rds.amazonaws.com",
    user: "admin",
    password: "Satyam555!",
    database: "my_db",
    post: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }
    console.log("Database Connected...");
});

app.post('/submit', async (request, response) => {
    const {
        userName,
        language,
        stdInput,
        code
    } = request.body;

    // Get the current date and time in UTC
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery = `
    INSERT INTO submission (username, code_language, std_input, code, submission_time)
    VALUES (?, ?, ?, ?, ?);`;

    db.query(insertQuery, [userName, language, stdInput, code, currentDateTime], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.message);
            response.status(500).json({ error: "Error submitting data" });
            return;
        }
        console.log("Data inserted successfully:", result);
        response.status(200).json({ message: "Data submitted successfully" });
    });
});


app.get('/submissions', async (request, response) => {
    try {
        const getSubmissionsQuery = `SELECT * FROM submission;`;
        
        // Execute the query and await the result
        const result = await new Promise((resolve, reject) => {
            db.query(getSubmissionsQuery, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        
        // Send the query result as the response
        response.send(result);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        response.status(500).send("Error fetching submissions");
    }
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
