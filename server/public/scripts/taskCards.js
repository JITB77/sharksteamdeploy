document.addEventListener('DOMContentLoaded', function() {
    // Function to handle task deletion
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the task');
            }
            console.log(`Task with ID ${id} deleted successfully.`);
            // Redirect to /tasks page after deletion
            window.location.href = '/tasks';
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting task.');
        }
    };

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const taskId = event.target.getAttribute('data-id');
            await deleteTask(taskId); // Call the delete function when button is clicked
        });
    });


   // Handle the toggle status button
   document.querySelectorAll('.toggle-status-btn').forEach(button => {
    button.addEventListener('click', function () {
        const taskId = this.getAttribute('data-id');
        const newStatus = this.getAttribute('data-completed') === 'true' ? false : true;

        fetch(`/tasks/${taskId}/toggle-completed`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: newStatus })
        })
        .then(response => {
            if (response.ok) {
                window.location.reload(); // Refresh page to update the task tables
            } else {
                console.error('Failed to update task status');
            }
        })
        .catch(err => console.error(err));
    });
});

// Handle toggle visibility of completed tasks section
const toggleButton = document.getElementById('toggleCompleted');
const completedTable = document.querySelector('.completed');

// Check  for the visibility state
const isHidden = localStorage.getItem('completedTableHidden') === 'true';

if (isHidden) {
    completedTable.classList.add('hidden');
} else {
    completedTable.classList.remove('hidden');
}

toggleButton.addEventListener('click', function () {
    completedTable.classList.toggle('hidden');
    // Save the current state to localStorage
    localStorage.setItem('completedTableHidden', completedTable.classList.contains('hidden'));
});
});