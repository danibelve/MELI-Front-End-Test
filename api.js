var express = require('express'),
app = express(),
https = require('https'),
sassMiddleware = require('node-sass-middleware'),
request = require('request'),
path = require('path');
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

//Archivos estáticos
		// cuando diga /lib va a buscar a /node_modules
app.use('/lib',express.static(__dirname + '/node_modules')); 
app.use(express.static(__dirname + '/public'));

//Llamada al html index
app.get('/', function (req, res) {
  res.sendFile(__dirname +'/public/index.html');
});//fin get /

//Llamada al html busqueda
app.get('/items', function (req, res) {
  res.sendFile(__dirname + '/public/views/busqueda.html');
});//fin /items
//Llamada al html detalle
app.get('/items/:id', function (req, res, next) {
  res.sendFile(__dirname + "/public/views/detalle.html");
});//fin /items/:id


app.get('/api/items', function (req, res) {
  request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function (error, response, data) {
    if (error) {
      res.send("Algo salió mal");
    } else {
      data = JSON.parse(data);
      var results = [];
//Breadcrumb
/*      var data.filters = [];

    if (data.filters.length == 0) {
      results.categories.push(data.query);
    } else {
       data.categories = arrayCategorias(category);
      }
    }*/
//JSON para items 1-4
      for (var i = 0; i < 4; i++) {
        var product = data.results[i];

        results.push({
          id: product.id,
          title: product.title,
          price:/* {
            /*currency:*/ product.price//.currency_id,
            /*amount: product.price,*/
            /*decimals:*/
          // }
          picture: product.thumbnail,
          condition: product.condition,
          //Darle una segunda mirada
          free_shipping: product.shipping.free_shipping,
          city:product.address.state_name
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

//Detalle
app.get('/api/items/:id', function (req, res) {

  // hago primero el resquest del producto
  request('https://api.mercadolibre.com/items/' + req.params.id, function (error, response, body) {
    var product = JSON.parse(body);

    // una vez que tengo el request del producto, hago un request por su descripcion
    request('https://api.mercadolibre.com/items/' + req.params.id + '/description', function (error, response, body) {
      var productDescription = JSON.parse(body);

      // hago el request para la categoria del producto
      request('https://api.mercadolibre.com/categories/' + product.category_id, function (error, response, body) {
        var category = JSON.parse(body);

        // armo el json de respuesta final con la info el producto y su descripcion
        var response = {
          author: {
            name: "Daniela",
            lastname: "Belvedere"
          },
          item: {
            id: product.id,
            title: product.title,
            price: product.price,
            picture: product.secure_thumbnail,
            condition: product.condition,
            free_shipping: product.shipping.free_shipping,
            description: productDescription.text,
            sold_quantity: product.sold_quantity,
            categories: arrayCategorias(category)
          }
        }

        res.send(response);

      });
    });
  });

});

//Array de categorias
function arrayCategorias(categories) {
    return categories.path_from_root.map( function (category) { return category.name } );
}

//Setteo de localhost
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
