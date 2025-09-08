const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(`Hashed password for "${password}": ${hashedPassword}`);
  return hashedPassword;
}

// Replace 'password123' with the passwords you want to hash
hashPassword('customer_pass');
hashPassword('seller_pass');
hashPassword('admin_pass');