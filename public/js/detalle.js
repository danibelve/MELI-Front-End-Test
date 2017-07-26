$(document).ready(function () {
  var pattern = new UrlPattern('/items/:id'),
    params = pattern.match(location.pathname);

  console.log(params);

  $.get("/api/items/" + params.id, function (res) {

    console.log(res);

    $("#ml-response").append("<p>" + res.item.categories.join(" > ") + "</p>");

    $("#productTemplate")
      .tmpl([res.item])
      .appendTo("#ml-response");

  });
});
