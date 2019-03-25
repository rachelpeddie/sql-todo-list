console.log('js');

$(document).ready(onStart);

function onStart() {
    console.log('jq');
    getTasks();
    $('#btn-add-task').on('click', addTask);
    $('#task-list').on('click', '.btn-delete', removeTask);
    $('#task-list').on('click', '.btn-status', updateStatus)
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

// function to render all existing tasks into table on DOM
function renderTasks(taskArray) {
    $('#task-list').empty();
    for (task of taskArray) {
        if (task.status === 'Incomplete') {
            let $tr = $(`<tr>
                <td>${task.taskname}</td>
                <td>${task.status}</td>
                <td><button class="btn-delete">Delete</button></td>
                <td><button class="btn-status">Completed</button></td>
            </tr>`);
            $('#task-list').append($tr);
            $tr.data(task);
        }
        else if (task.status === 'Completed') {
            let $tr = $(`<tr class="task-complete">
                <td>${task.taskname}</td>
                <td>${task.status}</td>
                <td><button class="btn-delete">Delete</button></td>
                <td> </td>
            </tr>`);
            $('#task-list').append($tr);
            $tr.data(task);
        }
    }
} // end renderTasks

// function to delete data for closest table row task on delete button click
function removeTask() {
    let $deleteButton = $(this);
    let $tr = $deleteButton.closest('tr'); // closest will work it's way up the heirarchy and attach data to the first 'tr' found
    let taskId = $tr.data('id');
    console.log('Task id is: ', taskId);
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            swal("Poof! Your imaginary file has been deleted!", {
                icon: "success",
            });
            $.ajax({
                method: 'DELETE',
                url: `/tasks/${taskId}`
            }).then(function (response) {
                getTasks();
            }).catch(function () {
                console.log(`Couldn't delete your task: ${taskId}`);
                alert(`Try again later`);
            })
        }
        else {
            swal("Your imaginary file is safe!");
        }
    });
} // end removeTask


function updateStatus() {
    let $updateButton = $(this);
    let $tr = $updateButton.closest('tr');
    let taskId = $tr.data('id');
    let task = $tr.data();
    console.log(taskId);
    console.log(task.status);
    $.ajax({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        data: task
    }).then(function (response) {
        getTasks();
    })
        .catch(function () {
            console.log('Something bad happened can not update', taskId);
            alert(`Couldn't update task, try again later`);
        })
}
