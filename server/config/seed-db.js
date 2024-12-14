import { pool } from './database.js';

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
        const dropTablesQuery = `
            DROP TABLE IF EXISTS tasks CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        `;
        await pool.query(dropTablesQuery);
        console.log("Tables dropped successfully.");
    } catch (error) {
        console.error("Error dropping tables:", error);
    }
};

const createTables = async () => {
    try {
        console.log('Creating tables...');
        const createTablesQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                hashedPassword VARCHAR(500) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                deadline DATE NOT NULL,
                priority INT CHECK (priority BETWEEN 1 AND 2) NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        await pool.query(createTablesQuery);
        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

const insertData = async () => {
    try {
        console.log('Inserting initial data...');
        
        // Insert user and return the generated id
        const insertUsersQuery = `
            INSERT INTO users (username, hashedPassword)
            VALUES 
                ('test_user', '$2b$10$e0MYzXyjpJS7Pd0RVvHwHeYb5QwW1Kvrx43wr8HpJbV7MxEsQdRZa') 
            RETURNING id;
        `;
        const userResult = await pool.query(insertUsersQuery);
        const testUserId = userResult.rows[0].id;

        // Insert tasks using the returned user ID
        const insertTasksQuery = `
            INSERT INTO tasks (user_id, name, description, deadline, priority, completed) 
            VALUES 
                ($1, 'Buy groceries', 'Purchase milk, eggs, bread, and vegetables from the store.', '2024-12-15', 1, true),
                ($1, 'Complete project', 'Finish the web development project and deploy it.', '2024-12-20', 2, false),
                ($1, 'Doctor appointment', 'Visit the dentist for a routine check-up.', '2024-12-12', 1, false),
                ($1, 'Plan holiday trip', 'Research and book flights and hotels for the holiday trip.', '2024-12-25', 2, false),
                ($1, 'Pay utility bills', 'Pay the electricity and water bills online.', '2024-12-10', 1, false),
                ($1, 'Team meeting', 'Prepare slides for the upcoming team meeting and attend it.', '2024-12-14', 2, false);
        `;
        await pool.query(insertTasksQuery, [testUserId]);

        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

const setup = async () => {
    try {
        await dropTables();
        await createTables();
        await insertData();
    } catch (error) {
        console.error("Error during setup:", error);
    } finally {
        await pool.end(); // Close database connection
    }
};

setup();
