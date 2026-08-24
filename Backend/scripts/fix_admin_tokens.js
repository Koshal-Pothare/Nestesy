const fs = require('fs');
const path = require('path');

const files = [
  'Frontend/src/Admin/AdminDashboard.jsx',
  'Frontend/src/Admin/HostManagement.jsx',
  'Frontend/src/Admin/TenantManagment.jsx',
  'Frontend/src/Admin/PropertyVerificationDetail.jsx',
  'Frontend/src/Admin/BookingOverview.jsx',
  'Frontend/src/Admin/ReviewManagement.jsx',
  'Frontend/src/Admin/InquiryManagement.jsx',
];

const OLD = `localStorage.getItem('adminToken') || localStorage.getItem('token')`;
const NEW = `localStorage.getItem('adminToken')`;

files.forEach(relPath => {
  const fullPath = path.join('e:/NEWproject', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log('NOT FOUND:', relPath);
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(OLD)) {
    const updated = content.split(OLD).join(NEW);
    fs.writeFileSync(fullPath, updated, 'utf8');
    const count = (content.split(OLD).length - 1);
    console.log(`Fixed (${count} replacements): ${relPath}`);
  } else {
    console.log('No change needed:', relPath);
  }
});
console.log('Done!');
