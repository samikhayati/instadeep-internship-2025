const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'instadp',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    

});












const insertTask = async (title,description,priority,category,dueDate,status) => {
    const query = 'INSERT INTO tasks (title,description,priority,category,dueDate,status) VALUES (?, ?, ?,?,?,?)';
    return new Promise((resolve, reject) => {
        db.query(query, [title,description,priority,category,dueDate,status], (err, result) => {
            if (err) {
                reject('Database query failed while inserting task');
            } else {
                resolve(result.insertId); // Return the inserted contact ID
            }
        });
    });
};

const updateTask = async (title,description,priority,category,dueDate,status,idtask) => {
    const query = 'UPDATE tasks SET title = ? description = ? priority = ? category = ? dueDate = ? status = ? where idtask=?';
    return new Promise((resolve, reject) => {
        db.query(query, [title,description,priority,category,dueDate,status,idtask], (err, result) => {
            if (err) {
                reject('Database query failed while inserting task');
            } else {
                resolve(result.insertId); // Return the inserted contact ID
            }
        });
    });
};

const getTasks = async (category,dueDate) => {
    let query = 'SELECT * FROM tasks WHERE';
    let params = [];
    if(category!=null & dueDate!=null){
        query += ' category = ? AND dueDate = ?';
        params.push(`%${category}%`);
        params.push(`%${dueDate}%`);
    }
    else if(category!=null){
        query += ' category = ?';
        params.push(`%${category}%`);
    }
    else if(dueDate!=null){
        query += ' dueDate = ?';
        params.push(`%${dueDate}%`);
    }

    return new Promise((resolve, reject) => {
        if(params==[]){reject()};
        db.query(query, params, (err, result) => {
            if (err) {
                reject('Database query failed while gettings Tasks');
            } else {
                resolve(result); // Return the inserted contact ID
            }
        });
    });
};

const deleteTask = async (idtask) => {
    const query = 'DELETE FROM tasks WHERE idtask = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [idtask], (err, result) => {
            if (err) {
                reject('Database query failed while deleting tasks');
            } else {
                resolve(); // Return the inserted contact ID
            }
        });
    });
};


app.post('/addTask', async (req, res) => {//add checks for category
    const { title,description,priority,category,dueDate,status } = req.body;

    try {
        // Insert user and get the new contact ID
        await insertTask(title,description,priority,category,dueDate,status);


        // Send success response
        res.status(201).json({
            message: 'Task inserted succesfully',
        });
    } catch (err) {
        console.error(err); // Log the detailed error for server-side debugging
        res.status(500).json({ error: err });
    }
});

app.get('/getTasks', async (req, res) => {
    const { category,dueDate} = req.body;

    try {
        
        const tasks = await getTasks(category,dueDate);
        res.json(tasks);

    } catch (err) {
        console.error(err); // Log the detailed error for server-side debugging
        res.status(500).json({ error: err });
    }
});

app.delete('/deleteTask/:idtask', async (req, res) => {
    const {idtask} = req.params;
    try {
        
        const tasks = await deleteTask(idtask);

        res.status(201).json({
            message: 'Task deleted succesfully',
        });

    } catch (err) {
        console.error(err); // Log the detailed error for server-side debugging
        res.status(500).json({ error: err });
    }
});

app.patch('/updateTask', async (req, res) => {
    const { title,description,priority,category,dueDate,status } = req.body;
    const {idtask} = req.params;

    try {
        // Insert user and get the new contact ID
        await updateTask(title,description,priority,category,dueDate,status,idtask);


        // Send success response
        res.status(201).json({
            message: 'Task inserted succesfully',
        });
    } catch (err) {
        console.error(err); // Log the detailed error for server-side debugging
        res.status(500).json({ error: err });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
