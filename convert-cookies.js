/**
 * @file Convert cookies copy/pasted from Chrome's Application -> Storage -> Cookies -> [domain] table,
 * into the Netscape cookies format used by tools like `curl` or `youtube-dl`.
 */
const fs = require('fs');

const filename = process.argv[2];
if (!filename) {
  console.error(`Usage: node convert-cookies.js <file-with-cookies-copy-pasted-from-Chrome.txt> > netscape-cookies.txt`);
  console.error();
  console.error(`Make sure to replace <file-with-cookies-copy-pasted-from-Chrome.txt> with the name of the\nfile in which you copy/pasted the cookies from Chrome's Application -> Storage -> Cookies.`);
  console.error(`\nThen, pass the 'netscape-cookies.txt' file to 'curl' or 'youtube-dl' or any other tool\nthat reads cookies in the Netscape cookies format.`);
  process.exit(1);
}

const content = fs.readFileSync(filename, 'utf8');
const cookies = content.split('\n');

console.log('# Netscape HTTP Cookie File');

for (const cookie of cookies) {
  let [name, value, domain, path, expiration, /* size */, httpOnly] = cookie.split('\t');
  if (!name)
    continue;
  if (domain.charAt(0) !== '.')
    domain = '.' + domain;
  httpOnly = httpOnly === '✓' ? 'TRUE' : 'FALSE'
  if (expiration === 'Session')
    expiration = new Date(Date.now() + 86400 * 1000);
  expiration = Math.trunc(new Date(expiration).getTime() / 1000);
  console.log([domain, 'TRUE', path, httpOnly, expiration, name, value].join('\t'));
}
