//dos formas de llamar a ajax = $.ajax(); o .get

	function cargarTabla(){
		var busqueda = $('#name').val();				// en vez de name -> q para API MELI//
		$.get("http://jsonplaceholder.typicode.com/users",{name: busqueda}, function(data,status){
			for(var i = 0 ; i < data.length; i++){
				var persona = data [i];
				var nuevaFila ="<tr>"+
				"<td>" + persona.name +
				"</td> <td>" + persona.username +
				 "</td> <td>"+ persona.email + "</td>" +
				 "</tr>";
				$(".table tbody").append(nuevaFila); 
			}//for

		});//get
	}//function cargarTabla
