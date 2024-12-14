// Task creation
document.getElementById('taskForm').addEventListener('submit', async function(event) {
    event.preventDefault();  

    // Get form data
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskCompleted = document.getElementById('taskCompleted') ? document.getElementById('taskCompleted').checked : false;

    const taskData = {
        name: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        priority: taskPriority,
        completed: taskCompleted
    };

    try {
        // POST request for creating a new task
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Task created successfully!');
            window.location.href = '/tasks'; // Redirect after task is created
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error handling task creation:', error);
        alert('Error handling task creation.');
    }
});


// Task deletion
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const taskId = event.target.getAttribute('data-id');
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Task deleted successfully');
                    window.location.href = '/tasks'; // Redirect to tasks list
                } else {
                    console.error('Failed to delete task');
                    alert('Error deleting task.');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task.');
            }
        }
    });
});



/// Task update 
document.getElementById('update-btn')?.addEventListener('click', async (event) => {
    const taskId = event.target.getAttribute('data-id');

    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskCompleted = document.getElementById('taskCompleted') ? document.getElementById('taskCompleted').checked : false;

    const taskData = {
        name: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        priority: taskPriority,
        completed: taskCompleted
    };

    try {
        // PUT request for updating the task
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const updatedTask = await response.json();
            alert('Task updated successfully!');
            window.location.href = '/tasks'; // Redirect after task is updated
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task.');
    }
});