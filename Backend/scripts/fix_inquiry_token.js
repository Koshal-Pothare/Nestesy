const fs = require('fs');
const path = require('path');

// Fix InquiryManagement.jsx which uses double quotes
const files = [
  'Frontend/src/Admin/InquiryManagement.jsx',
];

const OLD = `localStorage.getItem("adminToken") || localStorage.getItem("token")`;
const NEW = `localStorage.getItem("adminToken")`;

files.forEach(relPath => {
  const fullPath = path.join('e:/NEWproject', relPath);
  if (!fs.existsSync(fullPath)) { console.log('NOT FOUND:', relPath); return; }
  const content = fs.readFileSync(fullPath, 'utf8');
  const count = (content.split(OLD).length - 1);
  if (count > 0) {
    const updated = content.split(OLD).join(NEW);
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Fixed (${count} replacements): ${relPath}`);
  } else {
    console.log('No change needed:', relPath);
  }
});
console.log('Done!');
