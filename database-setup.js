import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to set up and initialize the MySQL database
 * for the Wanderlust Travel Website
 */
async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Database connection configuration
  const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };
  
  // Database name
  const DB_NAME = process.env.DB_NAME || 'wanderlust_db';
  
  try {
    // Create connection
    console.log('Connecting to MySQL server...');
    const connection = await mysql.createConnection(DB_CONFIG);
    
    // Create database if it doesn't exist
    console.log(`Creating database ${DB_NAME} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Database ${DB_NAME} created or already exists.`);
    
    // Select the database
    console.log(`Selecting database ${DB_NAME}...`);
    await connection.query(`USE ${DB_NAME}`);
    
    // Read and execute SQL script
    const sqlFilePath = path.join(__dirname, 'init-database.sql');
    console.log(`Reading SQL script from ${sqlFilePath}...`);
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL script...');
    await connection.query(sqlScript);
    console.log('SQL script executed successfully.');
    
    // Close connection
    await connection.end();
    console.log('Database connection closed.');
    
    console.log('Database setup completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin User:');
    console.log('  Email: admin@wanderlust.com');
    console.log('  Password: admin123');
    console.log('\nRegular User:');
    console.log('  Email: john@example.com');
    console.log('  Password: admin123');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();