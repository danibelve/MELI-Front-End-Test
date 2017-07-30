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

    function getCategories (data) {
        // busco el filtro id = category
        var categorias = data.filters.filter(function (filter) { return filter.id == "category"})

        // si en los filtros vino el de category
        if (categorias.length && categorias[0].values && categorias[0].values.length && categorias[0].values[0]) {
            // array de categorias
            return categorias[0].values[0].path_from_root.map(function (category) { return category.name });
        } else {
            // array con el termino de búsqueda
            return [data.query];
        }//fin else
    }//fin getCategories
// JSON modificado para price
/*var precioModificado = {};
        precioModificado.currency = data.results.currency_id;
        //No es un número, al parecer.
          if (Number.isInteger(data.results.price)) {
            precioModificado.amount = data.results.price;
            precioModificado.decimals = 0;
          } else {
            precioModificado.amount = Math.floor(data.results.price);
            precioModificado.decimals = parseInt(data.results.price.toString().split('.')[1]);
          }*/
//console.log(precioModificado);
//JSON para items 1-4
      for (var i = 0; i < 4; i++) {
        var product = data.results[i];


        results.push({
          id: product.id,
          title: product.title,
          price:{
            currency: product.currency_id,
            amount: Math.floor(product.price),
            decimals: product.price.toString().split('.')[1] 
          }, 
          picture: product.thumbnail,
          condition: product.condition,
          //Darle una segunda mirada
          free_shipping: product.shipping.free_shipping,
          city:product.address.state_name

        });
      }
console.log(results);
      var itemResults = {
        author: {
          name: "Daniela",
          lastname: "Belvedere"
        },
        categories: getCategories(data),
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
            price:{
              currency: product.currency_id,
              amount:  Math.floor(product.price),
              decimals: product.price.toString().split('.')[1] 
            }, 
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
