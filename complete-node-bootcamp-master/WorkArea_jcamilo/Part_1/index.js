const fs  = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');

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

const server = http.createServer((req, res) => {
    // console.log(req.url);
    const pathName = req.url
    if(pathName === '/' || pathName === '/overview'){
        res.end('This is the OVERVIEW!!!-)!');
    }else if (pathName === '/product'){
        res.end('This is the PRODUCT!-)!');
    } else if(pathName === '/api'){

        fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=> {
            const productData = JSON.parse(data);
            res.writeHead(200,{'Content-type': 'application/json'})
            // console.log(productData);
            res.end(data);
        })
        
    } else {
        res.writeHead(404, {
            'Content_type': 'html',
            'my-own-headr':'Hello World!!!'
        });
        res.end('Page not found!');  
    }
});
// 127.0.0.1 this is the standard ip for localhost
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requiests on port 8000')
});

//ROUTING THE WEB