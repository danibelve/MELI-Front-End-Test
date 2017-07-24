$(document).ready(function () {
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("search"), function (res) {
  	console.log(res);
  	$(".resultado").append(res.items);
    /*$("#productTemplate")
      .tmpl(res.items)
      .appendTo("#ml-response");*/

  });
});
