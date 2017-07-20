
var express = require('express'),
app = express(),
https = require('https'),
sassMiddleware = require('node-sass-middleware'),
request = require('request'),
path = require('path');
// cuando diga /lib va a buscar a /node_modules
app.use('/lib',express.static(__dirname + '/node_modules')); 
app.use('/public', express.static(__dirname + '/public'));

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


app.get('/', function (req, res) {
  res.sendFile(__dirname +'/public/index.html');
  /*los agrego uno por uno ya que son independientes
  res.sendFile(__dirname +'/public/views/busqueda.html');
  res.sendFile(__dirname +'/public/views/detalle.html');*/
});//fin get /
app.get('/search', function (req,res){
	res.sendFile(__dirname + '/public/views/busqueda.html');
});
	//aca tendria que decir ITEMS utilizar el requiere
app.get('/prod', function(req,res){
	https.get("https://api.mercadolibre.com/sites/MLA/search", function (response){
		var body = '';
		response.on('data',function(d){
			body += d;
		});
		response.on('end', function(){
			console.log(JSON.parse(body));
			body = JSON.parse(body);
			// CON ESTE FOR SE GENERA UN CAMBIO DE KEY EN
			//DONDE SE GUARDAN LAS CLAVES FIRST_NAME Y LAST_NAME
			//EN UNA NUEVA KEY QUE SE LLAMA FULL_NAME QUE REEMPLAZA
			//A LAS DOS ANTERIORES (HACE UNA DE DOS,)
			/*for(var i=0; i< body.data.length; i++){
				var persona = body.data[i];
				var personaNueva ={};
				personaNueva.id = persona.id;
				personaNueva.avatar = persona.avatar;
				personaNueva.full_name = persona.first_name + " "+ persona.last_name;

				body.data[i]=personaNueva;
			}*/
			res.send(body);
		});
	});
});
//necesito para avisarle qué pasa cuando productos/ tiene algo después
app.get('/prod/:user_id', function(req,res){
	//.user_id refiere a como guarde aca arriba lo que viene después de user
	//res.send(req.params.user_id);
			//URL sacada como "single user"
	https.get("https://reqres.in/api/users/" + req.params.user_id, function (response){
		var body = '';
		response.on('data',function(d){
			body += d;
		});
		response.on('end', function(){
			console.log(JSON.parse(body));
			body = JSON.parse(body);
			res.send(body);
		});
	});

});
app.get('/detalle', function(req,res){
	res.sendFile(__dirname +'/public/views/detalle.html');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
