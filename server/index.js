const PORT = 8000
const express = require('express')
const cors = require('cors')
const bodyparser = require("body-parser")
const mysql = require("mysql2");
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }));

const API_KEY = 'API_KEY'

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "PASSWORD",
    database: "script_writing_software"
})

app.post('/suggest-titles', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `${req.body.plot} suggest 3 titles for this plot`
                }
            ],
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        const titles = data.choices[0].message['content'].split('\n').filter(title => title !== '');
        res.send({ titles });

    } catch (error) {
        console.log(error)
    }
})

app.post('/character', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `name:${req.body.name} description:${req.body.description} generate character`
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

app.post('/scene', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `${req.body.sheet} generate scene`
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
    const { title, plot, genre } = req.body;
    const sqlInsert = "INSERT INTO scripts (title, plot, genre ) VALUES (?, ?, ? )";
    db.query(sqlInsert, [title, plot, genre], (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.delete("/DELETE/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM scripts WHERE id=?";
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.get("/GET/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM scripts WHERE id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.put("/PUT/:id", (req, res) => {
    const { id } = req.params;
    const { title, plot, genre, content } = req.body;
    const sqlUpdate = "UPDATE scripts SET title = ?, plot = ?, genre=?, script=? WHERE id = ?";
    db.query(sqlUpdate, [title, plot, genre, content, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.get("/charGet", (req, res) => {
    const sqlGet = "SELECT id,name FROM characters";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});


app.post("/charPost", (req, res) => {
    const { name, description, info } = req.body;
    const sqlInsert = "INSERT INTO characters ( name, individuality, info) VALUES (?, ?, ?)";
    db.query(sqlInsert, [name, description, info], (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.get("/charGet/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM characters WHERE id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.put("/charPut/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, info } = req.body;
    const sqlUpdate = "UPDATE characters SET name = ?, individuality = ?, info = ? WHERE id = ?";
    db.query(sqlUpdate, [name, description, info, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.delete("/charDelete/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM characters WHERE id=?";
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});


app.get("/sceneGet", (req, res) => {
    const sqlGet = "SELECT * FROM scenes";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});


app.post("/scenePost", (req, res) => {
    const { sheet, content } = req.body;
    const sqlInsert = "INSERT INTO scenes ( beat_sheet, scene ) VALUES (?, ? )";
    db.query(sqlInsert, [sheet, content], (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.get("/sceneGet/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM scenes WHERE id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.put("/scenePut/:id", (req, res) => {
    const { id } = req.params;
    const { sheet, scene } = req.body;
    const sqlUpdate = "UPDATE scenes SET beat_sheet = ?, scene = ? WHERE id = ?";
    db.query(sqlUpdate, [sheet, scene, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.delete("/sceneDelete/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM scenes WHERE id=?";
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
