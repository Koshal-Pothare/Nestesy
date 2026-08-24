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
  'Frontend/src/Admin/AdminLout.jsx',
  'Frontend/src/auth/AdminLogin.jsx',
];

files.forEach(f => {
  const fullPath = path.join('e:/NEWproject', f);
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasBadSingle = content.includes("localStorage.getItem('token')");
  const hasBadDouble = content.includes('localStorage.getItem("token")');
  const hasAdmin = content.includes('adminToken');
  console.log(path.basename(f) + ': adminToken=' + hasAdmin + ' | bad_token_ref=' + (hasBadSingle || hasBadDouble));
});
