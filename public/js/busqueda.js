$.get("/prod", function(data){
	console.log(data);
	//total es una propiedad de la API
	// alert("Total de usuarios:" + data.total);
	// data.length es el data de la API
	/*for (var i = 0; i < data.data.length; i++) {
		//data.data[i].first_name es un dato del JSON de la API 
		// alert("usuario: " + data.data[i].first_name);
		var personaHTML ="";

		personaHTML +='<div class="gente">';
		personaHTML +=	'<a href="/detalle?user='+ data.data[i].id +'"><img src="'+ data.data[i].avatar +'"/></a>';
		personaHTML +=	'<p>';
		personaHTML +=		'<b>Nombre y apellido</b>: '+ data.data[i].full_name;
		personaHTML +=	'</p>';
		personaHTML +='</div>';

		$(".resultados").append(personaHTML);
		$("#loader").hide();
	}*/

});
