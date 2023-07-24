const PORT = 8000
const express = require('express')
const cors = require('cors')
const bodyparser = require("body-parser")
const mysql = require("mysql2");
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyparser.urlencoded({extended: true}));

const API_KEY = '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'

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "sukh!5011",
    database: "script_writing_software"
})

app.post('/completions' , async (req,res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [
                {
                  role: 'user',
                  content: `${req.body.title} ${req.body.plot} ${req.body.genre} script`
                }
            ],
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        res.send(data)
    } catch (error) { 
        console.log(error)
    }
})

app.get("/GET", (req, res) => {
    const sqlGet = "SELECT * FROM scripts";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.post("/POST", (req, res) => {
    const { title, plot, genre, content } = req.body;
    const sqlInsert = "INSERT INTO scripts (title, plot, genre, script) VALUES (?, ?, ?, ?)";
    db.query(sqlInsert, [title, plot, genre, content], (error, result) => {
        if(error) {
            console.log(error);
        }
    });
});

app.delete("/DELETE/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM scripts WHERE id=?";
    db.query(sqlDelete, id, (error, result) => {
        if(error) {
            console.log(error);
        }
    });
});

app.get("/GET/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM scripts WHERE id=?";
    db.query(sqlGet, id, (error, result) => {
        if(error){
            console.log(error);
        }
        res.send(result);
    });
});

app.put("/PUT/:id", (req, res) => {
    const { id } = req.params;
    const { title, plot, genre, content } = req.body;
    const sqlUpdate = "UPDATE users SET title = ?, plot = ?, genre=?, script=? WHERE id = ?";
    db.query(sqlUpdate, [title, plot, genre, content, id], (error, result) => {
        if(error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
