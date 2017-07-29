$(document).ready(function () {
 $(".input-search").attr({
  value: QueryParameters.getUrlParameter("search"),
	});
  
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("search"), function (res) {
  	console.log(res.items);
  	$("#pan").append('<p class="pan"> Inicio > ' + res.categories.join(" > ") + '</p>');
    $("#template")
      .tmpl(res.items)
      .appendTo("#respuesta-meli");
  });
});
