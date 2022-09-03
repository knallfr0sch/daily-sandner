/* eslint-disable @typescript-eslint/no-var-requires */
const headerFontPath = './assets/OPTIEngraversOldEnglishBase64.txt';
const headerFont = require('fs').readFileSync(headerFontPath);
console.log(headerFont);

export function generateFont() 
{
  return `
     @font-face {
        font-family: 'Engravers';
        src: url(data:application/x-font-woff;charset=utf-8;base64,${headerFont}) format('woff');
        font-weight: normal;
        font-style: normal;
     }
    `;
}
