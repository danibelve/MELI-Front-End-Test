$(document).ready(function () {
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("search"), function (res) {
  	console.log(res);
    $("#productTemplate")
      .tmpl(res.items)
      .appendTo("#ml-response");

  });
});
