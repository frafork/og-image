
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const logo = readFileSync(`${__dirname}/../_assets/logo_ff_black.png`).toString('base64');
const montserrat = readFileSync(`${__dirname}/../_fonts/Montserrat-Black.woff2`).toString('base64');
const montserrat_italic = readFileSync(`${__dirname}/../_fonts/Montserrat-Black-Italic.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    //let background = 'white';
    //let foreground = 'black';
    //let radial = 'lightgray';

    if (theme === 'dark') {
        //background = 'black';
        //foreground = 'white';
        //radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 900;
        src: url(data:font/woff2;charset=utf-8;base64,${montserrat})  format("woff2");
    }

    @font-face {
        font-family: 'Montserrat-Italic';
        font-style: italic;
        font-weight: 900;
        src: url(data:font/woff2;charset=utf-8;base64,${montserrat_italic})  format("woff2");
    }

    * {
        box-sizing: border-box;
    }

    html {
        margin: 0;
        padding: 0;
    }

    body {
        margin: 0;
        background: linear-gradient(165deg, rgba(8,174,234,1) 0%, rgba(42,245,152,1) 100%);
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 5vh;
    }

    .title_container {
        font-family: 'Montserrat-Italic', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: italic;
        font-weight: 900;
        color: #000;
        line-height: 1;
        flex: 1;
    }

    .title {
        border-left: 20px solid black;
        padding: 5vh;
    }

    .logo {
        text-align: right;
    }

    .logo img {
        height: 75px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize} = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="title_container">
            <div class="title">
            ${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
        <div class="logo">
            <img src="data:image/png;base64,${logo}" />
        </div>
    </body>
</html>`;
}
