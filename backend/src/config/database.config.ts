import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config()

const DB_NAME = process.env.DB_NAME || ''; // Providing default empty string
const DB_USER = process.env.DB_USER || ''; // Providing default empty string
const DB_PWD = process.env.DB_PWD || '';   // Providing default empty string


// Check if environment variables are defined
if (!DB_NAME || !DB_USER || !DB_PWD) {
    console.error("Database configuration is incomplete. Please check your environment variables.");
    process.exit(1); // Exit the application
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Sync models with database
sequelize.sync({ alter: true })
.then(() => {
    console.log('Database synchronized successfully.');
})
.catch(err => {
    console.error('Error synchronizing database:', err);
});


export default sequelize;