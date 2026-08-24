const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

async function testAdminAPIs() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('DB Connected');

  const Admin = require('../src/admin/models/Admin');
  const Owner = require('../src/owner/models/Owner');
  const Tenant = require('../src/User/models/Tenant');

  const [admins, owners, tenants] = await Promise.all([
    Admin.find().select('name email role isActive').lean(),
    Owner.find().limit(5).select('name email isActive createdAt').lean(),
    Tenant.find().limit(5).select('name email isActive createdAt').lean(),
  ]);

  console.log('\n=== ADMINS ===');
  console.log(JSON.stringify(admins, null, 2));

  console.log('\n=== SAMPLE OWNERS (hosts) ===');
  owners.forEach(o => console.log(`- ${o.name} | ${o.email} | active: ${o.isActive}`));

  console.log('\n=== SAMPLE TENANTS (users) ===');
  tenants.forEach(t => console.log(`- ${t.name} | ${t.email} | active: ${t.isActive}`));

  console.log('\nTotal Owners:', await Owner.countDocuments());
  console.log('Total Tenants:', await Tenant.countDocuments());

  // Test if admin JWT is valid
  const jwt = require('jsonwebtoken');
  if (admins.length > 0) {
    const admin = admins[0];
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('\nTest admin JWT token (for browser debugging):');
    console.log(token);
  }

  await mongoose.disconnect();
}

testAdminAPIs().catch(console.error);
