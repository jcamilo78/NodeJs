// First call the global module 
const fs  = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');
// Second call 3rd Party modules
const slugify = require('slugify');
//Third call local project modules
const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////////////////////////////
// FILES

// Blocking, synchronous way
/* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `\nThis is what we know about the avocado: ${textIn}.\Created on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut);

console.log('File written!!-)') 

*/
//// Blocking, asynchronous way

// fs.readFile('./txt/staaaaart.txt','utf-8', (err, data) => {
//     // this is for error handling
//     if (err) return console.log('ERROR! :-)')
//     console.log(data);
// })

// fs.readFile('./txt/start.txt','utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8', (err, data3) => {
//             console.log(data3);
          /*  fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', err => {
                console.log('Your file has been written')
            })
//             */
// })
//     })
// })

// console.log('Will read file!');
/*
const testFile = fs.readFileSync('./txt/start.txt', 'utf-8');
console.log(testFile);
*/
/////////////////////////////////
// SERVER

// in this way is more efficient because we just load once
// data from templates folder to load once when the apps in init in this way is more efficient
// in this way e create a function to dymamicilly changes the selection and the /g mean that is a for global use this variables
// const replaceTemplate = (temp, product) => {
    // let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    // output = output.replace(/{%IMAGE%}/g, product.image);
    // output = output.replace(/{%PRICE%}/g, product.price);
    // output = output.replace(/{%FROM%}/g, product.from);
    // output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    // output = output.replace(/{%QUANTITY%}/g, product.quantity);
    // output = output.replace(/{%DESCRIPTION%}/g, product.description);
    // output = output.replace(/{%ID%}/g, product.id);
    // 
    // if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    // return output;
// }
// 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);
// console.log(slugify('Fresh Avocados', { lower : true}));

const server = http.createServer((req, res) => {
    // to parse the url uncomment the following 2 lines
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    const {query, pathname} = url.parse(req.url, true);
    // const pathname = req.url;

// Overview page 
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
          'Content-type': 'text/html'
    }); 
    //    investigate the map function
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
        // next line is for testing 
        // console.log(cardsHtml);
// Product Page 
    }else if (pathname === '/product'){
      res.writeHead(200, { 'Content-type': 'text/html'});
        // console.log(query);
        // res.end(tempProduct);
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
// Api 
    } else if(pathname === '/api'){
        const productData = JSON.parse(data);
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(data);
        
// Not Found 
    } else {
        res.writeHead(404, {
            'Content_type': 'html',
            'my-own-headr':'Hello World!!!'
        });
        res.end('<h1>Page not found!</h1>');  
    }
});
// 27.0.0.1 this is the standard ip for localhost
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requiests on port 8000');
});

//ROUTING THE WEB