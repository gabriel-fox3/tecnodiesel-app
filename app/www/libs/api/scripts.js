function events_scripts() {
  var c = connect;

  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var el = $(this);
    var user = el.find('[name="inputUsuario"]').val();
    var pass = el.find('[name="inputSenha"]').val();
    pass = CryptoJS.MD5(pass).toString();
    c.login(user, pass);
  });

  $('#form_cad_cliente').on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var el = $(this);
    
    c.cad_cliente(el.serializeArray());
    
  });
}

$(document).ready(function () {

  events_scripts();
});