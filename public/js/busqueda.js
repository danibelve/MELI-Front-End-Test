$(document).ready(function () {
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("search"), function (res) {

    $("#productTemplate")
      .tmpl(res.items)
      .appendTo("#ml-response");

  });
});
