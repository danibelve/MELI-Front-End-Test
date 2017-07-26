$(document).ready(function () {
 $(".input-search").attr({
  value: QueryParameters.getUrlParameter("search"),
	});
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("search"), function (res) {
    $("#template")
      .tmpl(res.items)
      .appendTo("#respuesta-meli");
  });
});
