import { pool } from '../config/database.js';

// Get all tasks
const getTasks = async (filter) => {
  let query = 'SELECT * FROM tasks';
  if (filter?.completed !== undefined) {
      query += ` WHERE completed = ${filter.completed} ORDER BY deadline ASC`;
  }
  const results = await pool.query(query);
  return results.rows;
};


// Get a task by ID
const getTask = async (id) => {
  const results = await pool.query('SELECT * FROM tasks WHERE id=$1', [id]);
  return results.rows[0];
};

// Get completed tasks
const getCompletedTasks = async () => {
  const results = await pool.query('SELECT * FROM tasks WHERE completed = TRUE ORDER BY deadline ASC');
  return results.rows;
}

// Get all important tasks (priority = 1)
const getImportantTasks = async () => {
  const results = await pool.query(
    'SELECT * FROM tasks WHERE priority = 1 AND completed = false ORDER BY deadline ASC'
  );
  return results.rows;
};

// Create a new task
const createTask = async (task) => {
  const { name, description, deadline, priority, completed } = task;
  const results = await pool.query(
    'INSERT INTO tasks (name, description, deadline, priority, completed, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
    [name, description, deadline, priority, completed, 1]  // Setting user_id as 1
  );
  return results.rows[0];  
};

// Update task completion status
const updateTaskCompletion = async (id, completed) => {
    const results = await pool.query(
        'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id]
    );
    return results.rows[0]; // Return the updated task
};

// Delete a task by ID
const deleteTask = async (id) => {
  const results = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
  return results.rows[0]; // Return the deleted task's data if successful
};

// Update task data
const updateTask = async (id, updatedData) => {
  // Delete the old task
  const deletedTask = await deleteTask(id);
  if (!deletedTask) {
      throw new Error(`Task with id ${id} not found`);
  }

  // Create a new task with the updated data, excluding the `id` field
  const newTask = await createTask({
      name: updatedData.name || deletedTask.name,
      description: updatedData.description || deletedTask.description,
      deadline: updatedData.deadline || deletedTask.deadline,
      priority: updatedData.priority || deletedTask.priority,
      completed: updatedData.completed !== undefined ? updatedData.completed : deletedTask.completed,
  });

  return newTask; // Return the new task as the updated task
};




export { getTasks, getTask, getCompletedTasks, createTask, updateTaskCompletion, deleteTask, updateTask, getImportantTasks };
 