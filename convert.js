const fs = require('fs');

let html = fs.readFileSync('C:\\Users\\user\\Desktop\\WEBデザイン\\LP\\9.medical_care\\index.html', 'utf8');

// Extract style
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('app/lp.css', styleMatch[1]);
}

// Extract body
let bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
let body = bodyMatch ? bodyMatch[1] : html;

// Convert class to className
body = body.replace(/class=/g, 'className=');
body = body.replace(/ for=/g, ' htmlFor=');

// Fix unclosed tags
body = body.replace(/<(img|br|input|hr)([^>]*?)(?<!\/)>/g, '<$1$2 />');

// Convert basic inline styles
body = body.replace(/style="([^"]*)"/g, (match, styles) => {
  const parts = styles.split(';').filter(s => s.trim());
  const styleObj = {};
  parts.forEach(p => {
    const [key, val] = p.split(':');
    if (key && val) {
      const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      styleObj[camelKey] = val.trim();
    }
  });
  return 'style={{ ' + Object.entries(styleObj).map(([k, v]) => `${k}: "${v}"`).join(', ') + ' }}';
});

// Update links
body = body.replace(/href="[^"]*booking[^"]*"/g, 'href="/booking"');
body = body.replace(/href="#web-booking"/g, 'href="/booking"');
body = body.replace(/href="#booking-form"/g, 'href="/booking"');

// Remove original script tags for mobile menu etc (we can re-implement if needed or ignore for now)
body = body.replace(/<script>[\s\S]*?<\/script>/g, '');

// Fix html comments in JSX
body = body.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Some other HTML attributes to JSX
body = body.replace(/tabindex=/g, 'tabIndex=');
body = body.replace(/readonly/g, 'readOnly');
body = body.replace(/colspan=/g, 'colSpan=');
body = body.replace(/rowspan=/g, 'rowSpan=');

const pageTemplate = `
import Link from 'next/link';
import './lp.css';

export default function Page() {
  return (
    <>
      ${body}
    </>
  );
}
`;

fs.writeFileSync('app/page.tsx', pageTemplate);
console.log('Conversion successful!');
