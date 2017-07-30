$(document).ready(function () {
  var pattern = new UrlPattern('/items/:id'),
    params = pattern.match(location.pathname);

  console.log(params);

  $.get("/api/items/" + params.id, function (res) {

    console.log(res);

    $("#pan").append('<p class="pan">' + res.item.categories.join(" > ") + '</p>');

    $("#productTemplate")
      .tmpl([res.item])
      .appendTo("#respuesta-meli");

  });
});
