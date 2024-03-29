const express = require('express');
const router = express.Router();

// DB CONNECTION
const pool = require('./pool');

router.get('/', (req, res) => {
    console.log('getting all tasks from db');
    pool.query('SELECT * FROM "tasks" ORDER BY "taskname";')
    .then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(`couldn't get all tasks`), error;
        res.sendStatus(500);
    })
})

router.put('/:id', (req, res) =>{
    let id = req.params.id;
    let taskData = req.body;
    console.log(`updating id ${id} with ${taskData}`);
    let sqlText = `UPDATE "tasks" SET "status"=$1 WHERE "id"=$2;`
    pool.query(sqlText, ['Completed', id])
    .then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(`couldn't update task with id ${id} with ${taskData}`, error);
        res.sendStatus(500);
    })
})

router.post('/', (req, res) => {
    let newTask = req.body;
    console.log(`new task is being added is:`, newTask);
    
    let sqlText = 'INSERT INTO "tasks" ("taskname", "status") VALUES($1, $2);';
    pool.query(sqlText, [newTask.taskname, newTask.status])
    .then((response) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log(`couldn't send new task ${newTask} to db`, error);
        alert(`That didn't work. Try again!`);
        res.sendStatus(500);
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    console.log(`deleting task with id=${id}`);
    let sqlText = `DELETE FROM "tasks" WHERE "id"=$1`;
    pool.query(sqlText, [id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((error) => {
            console.log(`Failed to delete task with id=${id}`, error);
            res.sendStatus(500);
        })
})

module.exports = router;