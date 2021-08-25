/**
 * @file Convert cookies copy/pasted from Chrome's Application -> Storage -> Cookies -> [domain] table,
 * into the Netscape cookies format used by tools like `curl` or `youtube-dl`.
 */
const fs = require('fs');
const path = require('path');

const scriptName = path.basename(process.argv[1]);
const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];

if (!inputFilePath) {
  console.error(`\nUsages:\n\tnode ${scriptName} input_file\n\tnode ${scriptName} input_file output_file\n`);
  console.error(`Make sure to replace input_file with the path of the file in which you copied`);
  console.error(`& pasted the cookies from Chrome's Application -> Storage -> Cookies table.`);
  console.error(`Pass the resultant file to 'curl' or 'youtube-dl' or any other tool that reads`);
  console.error(`cookies in the Netscape cookies format.\n`);
  process.exit(1);
}

const content = fs.readFileSync(inputFilePath, 'utf8');
const cookies = content.split('\n');

const headComment = '# Netscape HTTP Cookie File';
var outputFileStream;
if (outputFilePath) {
  outputFileStream = fs.createWriteStream(outputFilePath);
  outputFileStream.write(headComment);
  outputFileStream.write('\n');
} else {
  console.log(headComment);
}

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
  resultRecord = [domain, 'TRUE', path, httpOnly, expiration, name, value].join('\t');
  if (outputFileStream) {
    outputFileStream.write(resultRecord);
    outputFileStream.write('\n');
  } else {
    console.log(resultRecord);
  }
}
