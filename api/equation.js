const preprocessor = require('mathjax-node-sre').preprocessor;

module.exports = async (req, res) => {
  console.log(req.query);
  preprocessor({ math: req.query.tex, format: 'TeX' }, function(output) {
    console.log(output.math); // => <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" alttext="x^2"><msup data-semantic-type="superscript" data-semantic-role="latinletter" data-semantic-id="2" data-semantic-children="0,1"><mi data-semantic-type="identifier" data-semantic-role="latinletter" data-semantic-font="italic" data-semantic-id="0" data-semantic-parent="2">x</mi><mn data-semantic-type="number" data-semantic-role="integer" data-semantic-font="normal" data-semantic-id="1" data-semantic-parent="2">2</mn></msup></math>
    res.set('Content-Type', 'image/svg+xml');
    res.end(output.math);
  });
};
