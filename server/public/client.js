console.log('js');

$(document).ready(onStart);

function onStart() {
    console.log('jq');
    getTasks();
    $('#btn-add-task').on('click', addTask);
}

// function to empty all inputs on click
function emptyInputs() {
    $('#task-input').val('');
} // end emptyInputs

// function to get exising tasks from database
function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then((response) => {
        let tasks = response;
        console.log(`Here are all of your tasks: ${tasks}`);
        renderTasks(tasks);
    })
} // end getTasks

// function to add new task with input values
function addTask() {
    let newTask = {
        taskname: $('#task-input').val(),
        status: 'Incomplete'
    }
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
    }).then((response) => {
        console.log(`new task is: ${newTask}`);
        getTasks();
        emptyInputs();
        renderTasks(response);
    }).catch((response) => {
        console.log(`Your new task wasn't added.  Please try again.`);
    })
} // end addTask

function renderTasks(taskArray) {
    for( task of taskArray ){
        let $tr = $(`
        <tr>
        <td>${task.taskname}</td>
        <td>${task.status}</td>
        <td><button class="btn-delete">Delete</button></td>
        </tr>
        `);
        $('#task-list').append($tr);
        $trbutton.data(task)
    }
}