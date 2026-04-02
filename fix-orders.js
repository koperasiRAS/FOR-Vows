const fs = require('fs');
const path = 'c:\\Users\\ACER\\Downloads\\FOR Vows.co\\app\\admin\\orders\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix wrapping of table
content = content.replace(
  /className="w-full text-left border-collapse"/g,
  'className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]"'
);

fs.writeFileSync(path, content);
