Ecobazaar
Your ultimate destination for sustainable e-commerce

Ecobazaar is a full-stack e-commerce platform built with Node.js, Express, and MySQL, designed to provide a seamless shopping experience for eco-friendly products.

🌿 About
• More than just an e-commerce platform
• Community dedicated to environmental impact
• Curated collection of eco-friendly products
• Helps reduce carbon footprint without compromising style

✨ Features
User Experience
• Secure login/signup with JWT tokens
• Product management with full CRUD operations
• Shopping cart (add, remove, manage items)
• Complete order management system
• User profiles for personal information and order history
• Integrated secure payment processing
• Mobile-friendly responsive design

Admin Features
• Administrative panel for system management
• Product and order management tools
• User management and analytics
• System monitoring and reporting

🛠️ Tech Stack
Backend Technologies
• Node.js - Runtime environment
• Express.js - Web application framework
• MySQL - Database management system
• JWT - Authentication tokens
• bcryptjs - Password hashing
• mysql2 - MySQL client for Node.js

Dependencies
• cors - Cross-origin resource sharing
• dotenv - Environment variable management
• nodemon - Development server auto-restart

🚀 Getting Started
Prerequisites
• Node.js (version 14 or higher)
• MySQL (version 8.0 or higher)
• npm or yarn package manager

Installation Steps
Clone the repository

bash
git clone https://github.com/yourusername/ecobazaar.git
cd ecobazaar
Install dependencies

bash
npm install
Set up environment variables
• Create .env file in root directory
• Add the following variables:

text
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ecobazaar_db
JWT_SECRET=your_jwt_secret_key
Set up the database
• Create MySQL database named ecobazaar_db
• Run database migration scripts
• Import database schema from SQL files

Start the development server

bash
npm start          # Production
npm run dev        # Development with auto-restart
Access the application
• Open browser and go to http://localhost:3000

📁 Project Structure
text
ecobazaar/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management
│   └── orderController.js   # Order processing
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User model
│   ├── Product.js          # Product model
│   └── Order.js            # Order model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── products.js         # Product routes
│   └── orders.js           # Order routes
├── public/
│   ├── css/                # Stylesheets
│   ├── js/                 # Client-side JavaScript
│   └── images/             # Static images
├── views/                  # Template files
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── server.js              # Application entry point
🔧 API Endpoints
Authentication Endpoints
• POST /api/auth/register - User registration
• POST /api/auth/login - User login
• POST /api/auth/logout - User logout

Product Endpoints
• GET /api/products - Get all products
• GET /api/products/:id - Get product by ID
• POST /api/products - Create new product (Admin only)
• PUT /api/products/:id - Update product (Admin only)
• DELETE /api/products/:id - Delete product (Admin only)

Order Endpoints
• GET /api/orders - Get user orders
• POST /api/orders - Create new order
• GET /api/orders/:id - Get order by ID
• PUT /api/orders/:id - Update order status (Admin only)

Cart Endpoints
• GET /api/cart - Get user cart
• POST /api/cart - Add item to cart
• PUT /api/cart/:id - Update cart item
• DELETE /api/cart/:id - Remove item from cart

🗃️ Database Schema
Main Tables
• users - User accounts and profiles
• products - Product catalog information
• orders - Order information and status
• order_items - Individual order line items
• cart - Shopping cart items
• categories - Product categorization

🔒 Security Features
• JWT Authentication - Secure token-based authentication
• Password Hashing - bcryptjs for secure password storage
• CORS Protection - Cross-origin request handling
• Input Validation - Server-side validation for all inputs
• SQL Injection Prevention - Parameterized queries
• Environment Variables - Secure configuration management

🚀 Deployment Options
Local Development
bash
npm run dev
Production Deployment
bash
npm start
Environment Configuration
• Set NODE_ENV=production
• Use strong JWT secret key
• Configure production database credentials
• Set secure CORS origins
• Enable SSL/HTTPS in production

🤝 Contributing
How to Contribute
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
• Follow ESLint configuration
• Write clear and descriptive commit messages
• Add tests for new features
• Update documentation as needed
• Follow code style conventions

📊 Key Benefits
Environmental Impact
• Promotes sustainable shopping habits
• Reduces carbon footprint through informed choices
• Supports eco-friendly product vendors
• Builds community around environmental consciousness

Technical Advantages
• Modern web development practices
• Secure authentication and authorization
• Scalable architecture with Node.js and MySQL
• RESTful API design
• Responsive user interface

🎯 Future Enhancements
• Mobile application development
• Advanced search and filtering
• Payment gateway integrations
• Analytics and reporting dashboard
• Multi-language support
• Social features and reviews
