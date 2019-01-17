const fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const numCPUs = require('os').cpus().length;
const router = new Router();

function startMathJax() {
  var mjAPI = require('mathjax-node-sre');
  mjAPI.config({
    MathJax: {
      SVG: {
        font: 'STIX-Web',
      },
      tex2jax: {
        preview: ['[math]'],
        processEscapes: true,
        processClass: ['math'],
        // inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        // displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      },
      TeX: {
        noUndefined: { disabled: true },
        Macros: {
          mbox: ['{\\text{#1}}', 1],
          mb: ['{\\mathbf{#1}}', 1],
          mc: ['{\\mathcal{#1}}', 1],
          mi: ['{\\mathit{#1}}', 1],
          mr: ['{\\mathrm{#1}}', 1],
          ms: ['{\\mathsf{#1}}', 1],
          mt: ['{\\mathtt{#1}}', 1],
        },
      },
    },
  });
  mjAPI.start();
  return mjAPI;
}

const mjAPI = startMathJax();

const renderLatex = function(params) {
  return new Promise((resolve, reject) => {
    mjAPI.typeset(params, function(result) {
      resolve(result);

      // if (!result.errors) {
      //     if (params.svg) {
      //         response.writeHead(200, {'Content-Type': 'image/svg+xml'});
      //         response.end(result.svg);
      //     } else if (params.mml) {
      //         response.writeHead(200, {'Content-Type': 'application/mathml+xml'});
      //         response.end(result.mml);
      //     } else if (params.png) {
      //         response.writeHead(200, {'Content-Type': 'image/png'});
      //         // The reason for slice(22) to start encoding (from str to binary)
      //         // after base64 header info--data:image/png;base64,
      //         response.end(new Buffer(result.png.slice(22), 'base64'));
      //     }
      // } else {
      //     response.writeHead(400, {'Content-Type': 'text/plain'});
      //     response.write('Error 400: Request Failed. \n');
      //     response.write(String(result.errors) + '\n');
      //     response.write(str_params + '\n');
      //     response.end();
      // }
    });
  });
};

router.get('/equation', async function(ctx, next) {
  console.log(ctx.query);
  const result = await renderLatex({
    format: 'TeX',
    math: ctx.query.tex,
    svg: true,
    mml: false,
    png: false,
    speakText: true,
    speakRuleset: 'mathspeak',
    speakStyle: 'default',
    ex: 6,
    width: 1000000,
    linebreaks: false,
  });
  ctx.set('Content-Type', 'image/svg+xml');
  ctx.body = result.svg;
});

router.get('/', async function(ctx, next) {
  ctx.set('Content-Type', 'text/html');
  ctx.body = fs.readFileSync('./index.html');
});

app.use(router.routes());
app.listen(3000);
console.log(`app start add port > 3000`);
