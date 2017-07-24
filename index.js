
var express = require('express'),
app = express(),
https = require('https'),
sassMiddleware = require('node-sass-middleware'),
request = require('request'),
path = require('path');
// cuando diga /lib va a buscar a /node_modules
app.use('/lib',express.static(__dirname + '/node_modules')); 
app.use(express.static(__dirname + '/public'));
//Setteo Sass
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    /*outputStyle: 'compressed',*/
	outputStyle: 'extended',
    force: true,
    prefix: "/css"
  })
);

//Llamada al html index
app.get('/', function (req, res) {
  res.sendFile(__dirname +'/public/index.html');
});//fin get /

//Llamada al html busqueda
app.get('/items', function (req, res) {
  res.sendFile(__dirname + '/public/views/busqueda.html');
});//fin /items

//JSON para items 1-4
app.get('/api/items', function (req, res) {
  request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function (error, response, data) {
    if (error) {
      res.send("Algo salió mal");
    } else {
      data = JSON.parse(data);
      var results = [];

      for (var i = 0; i < 4; i++) {
        var product = data.results[i];

        results.push({
          id: product.id,
          title: product.title,
          //Necesito más información currency_id + Decimales
          price: product.price,
          picture: product.thumbnail,
          condition: product.condition,
          //Darle una segunda mirada
          /*free_shipping: product.shipping.free_shipping*/
        });
      }

      var itemResults = {
        author: {
          name: "Daniela",
          lastname: "Belvedere"
        },
        items: results
      }

      res.send(itemResults);
    }
  });
});
//Setteo de localhost
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
