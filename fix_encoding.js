const fs = require('fs');
let buf = fs.readFileSync('app/globals.css');
let text = buf.toString('utf8');
// By converting to string using utf8, invalid bytes become \uFFFD.
// Writing it back as utf8 will produce a valid UTF-8 file.
fs.writeFileSync('app/globals.css', text, 'utf8');
console.log('Encoding fixed');
