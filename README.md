# Wanderlust Travel Website

A full-stack travel and tours website with package browsing, booking functionality, and admin management.

## Installation Guide for Ubuntu

### Prerequisites
- Node.js v16+ and npm
- MySQL Server v8.0+

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/wanderlust-travel.git
cd wanderlust-travel
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up MySQL Database

#### Installing MySQL
If MySQL is not already installed:
```bash
sudo apt update
sudo apt install mysql-server
```

Start and enable MySQL service:
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

Secure your MySQL installation:
```bash
sudo mysql_secure_installation
```
Follow the prompts to set a root password and secure your MySQL installation.

#### Creating the Database and User
Access MySQL as root:
```bash
sudo mysql -u root -p
```
Enter your password when prompted.

Create the database and user:
```sql
CREATE DATABASE wanderlust_db;
CREATE USER 'wanderlust_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wanderlust_db.* TO 'wanderlust_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Importing Database Structure
You can use the provided script to automatically set up the database:
```bash
# Set environment variables for your database configuration
export DB_HOST=localhost
export DB_USER=wanderlust_user
export DB_PASSWORD=your_password
export DB_NAME=wanderlust_db

# Run the database setup script
node database-setup.js
```

Alternatively, you can manually import the SQL script:
```bash
mysql -u wanderlust_user -p wanderlust_db < init-database.sql
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory with the following configuration:

```
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=wanderlust_user
DB_PASSWORD=your_password
DB_NAME=wanderlust_db

# JWT Secret (used for authentication)
JWT_SECRET=your_jwt_secret_key
```

### Step 5: Start the Application
```bash
# For development
npm run dev

# For production
npm run build
npm start
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

You can log in with the following pre-configured accounts:

**Admin User:**
- Email: admin@wanderlust.com
- Password: admin123

**Regular User:**
- Email: john@example.com
- Password: admin123

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);
```

### Packages Table
```sql
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  shortDescription TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  reviews INTEGER NOT NULL DEFAULT 0,
  groupSize INTEGER NOT NULL DEFAULT 10,
  tags JSONB NOT NULL,
  highlights JSONB NOT NULL,
  inclusions JSONB NOT NULL,
  exclusions JSONB NOT NULL,
  itinerary JSONB NOT NULL,
  gallery JSONB
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  userId INTEGER,
  packageId INTEGER NOT NULL,
  packageName TEXT NOT NULL,
  packageLocation TEXT NOT NULL,
  bookingDate TEXT NOT NULL,
  startDate TEXT NOT NULL,
  travelers INTEGER NOT NULL,
  totalPrice INTEGER NOT NULL,
  contactName TEXT NOT NULL,
  contactEmail TEXT NOT NULL,
  contactPhone TEXT NOT NULL,
  specialRequests TEXT
);
```

### Destinations Table
```sql
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  image TEXT NOT NULL,
  tourCount INTEGER NOT NULL,
  featured BOOLEAN DEFAULT FALSE
);
```

### Special Offers Table
```sql
CREATE TABLE specialOffers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  originalPrice INTEGER NOT NULL,
  discountedPrice INTEGER NOT NULL,
  discountPercent INTEGER NOT NULL,
  expiryDate TEXT
);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL,
  packageName TEXT NOT NULL
);
```

### Newsletter Subscriptions Table
```sql
CREATE TABLE newsletterSubscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscriptionDate TEXT NOT NULL
);
```

## How It Works

### User Features
1. **Browse Travel Packages**
   - View all available travel packages on the homepage
   - See featured packages, popular destinations, and special offers
   - Filter packages by region, price range, duration, and activities

2. **Package Details**
   - View comprehensive information about each package
   - See package highlights, inclusions/exclusions, and day-by-day itinerary
   - View image gallery and reviews
   - Check availability and pricing

3. **User Account**
   - Register a new account with email and password
   - Log in to access user-specific features
   - View and manage personal profile information

4. **Booking System**
   - Select travel dates and number of travelers
   - Fill out booking and contact information
   - Review booking summary before confirmation
   - Receive booking confirmation with details

5. **User Dashboard**
   - View all past and upcoming bookings
   - Cancel bookings if needed
   - See booking details and travel information

6. **Newsletter Subscription**
   - Subscribe to receive updates on new packages and special offers

### Admin Features
1. **Dashboard**
   - Overview of website statistics
   - Recent bookings and user registrations
   - Quick access to key management areas

2. **Package Management**
   - Add new travel packages
   - Edit existing package details
   - Remove packages from the catalog
   - Manage package availability and pricing

3. **Booking Management**
   - View all customer bookings
   - Filter and search bookings
   - Process or cancel bookings

4. **User Management**
   - View registered users
   - Manage user roles and permissions

## Default Login Credentials
- **Admin User:**
  - Email: admin@wanderlust.com
  - Password: admin123

- **Regular User:**
  - Email: john@example.com
  - Password: admin123