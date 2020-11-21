import { NowRequest, NowResponse } from '@vercel/node';
const mathjaxNodeSre = require('mathjax-node-sre');

function startMathJax() {
  var mjAPI = mathjaxNodeSre;
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

const renderLatex = function (params) {
  return new Promise((resolve, reject) => {
    mjAPI.typeset(params, function (result) {
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

export default async (req: NowRequest, res: NowResponse) => {
  console.log(req.query);
  const result: any = await renderLatex({
    format: 'TeX',
    math: req.query.tex,
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

  console.log(result.svg); // => <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" alttext="x^2"><msup data-semantic-type="superscript" data-semantic-role="latinletter" data-semantic-id="2" data-semantic-children="0,1"><mi data-semantic-type="identifier" data-semantic-role="latinletter" data-semantic-font="italic" data-semantic-id="0" data-semantic-parent="2">x</mi><mn data-semantic-type="number" data-semantic-role="integer" data-semantic-font="normal" data-semantic-id="1" data-semantic-parent="2">2</mn></msup></math>
  // res.set('Content-Type', 'image/svg+xml');
  // res.headersSent('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(result.svg);
};
