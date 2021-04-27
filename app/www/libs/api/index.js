var connect = {
  host: 'http://localhost/live/tecnodiesel-admin/api/request.php',

  handle_obj: function (func, ext1 = null, ext2 = null, ext3 = null) {
    function _save(obj) {
      // console.log(obj);
      window.sessionStorage.setItem('tecnodiesel_db', JSON.stringify(obj));
      console.log(window.sessionStorage.getItem('tecnodiesel_db'));
      return obj;
    }
    var obj = window.sessionStorage.getItem('tecnodiesel_db');
    if (obj === null || obj === 'null') {
      obj = new Object();
    } else {
      obj = JSON.parse(obj);
    }
    switch (func) {
      case 'get':
        return obj;
      break;
      case 'set_key':
        obj[ext1] = ext2;
        return _save(obj);
      break;
      case 'set_sub_key':
        if (typeof obj[ext1] === typeof undefined) obj[ext1] = new Object();
        obj[ext1][ext2] = ext3;
        return _save(obj);
      break;
      case 'set_obj':
        obj = ext1;
        return _save(obj);
      break;
      case 'get_key':
        let tmp_key = obj[ext1];
        return tmp_key;
      break;
      case 'get_sub_key':
        let tmp_sub_key = obj[ext1][ext2];
        return tmp_sub_key;
      break;
      case 'remove':
        window.sessionStorage.removeItem('tecnodiesel_db');
      default:
        break;
    }
  },

  _d: function (data, key) {
    var chave = '6aad97b71db04e5d9e2926ebaf32d6a4';
    var DataEncrypt = data;
    var DataKey = CryptoJS.enc.Utf8.parse(key);
    var DataVector = CryptoJS.enc.Utf8.parse(chave.substring(0, 16));
    var decrypted = CryptoJS.AES.decrypt(DataEncrypt, DataKey, { iv: DataVector });
    var decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    return decrypted;
  },

  _c: function (data, key) {
    
    var chave = '6aad97b71db04e5d9e2926ebaf32d6a4';
    var DataEncrypt = data;
    var DataKey = CryptoJS.enc.Utf8.parse(key);
    var DataVector = CryptoJS.enc.Utf8.parse(chave.substring(0, 16));
    var crypted = CryptoJS.AES.encrypt(DataEncrypt, DataKey, { iv: DataVector });
    var crypted = crypted.toString();
    return crypted;
  },

  _token: function () {
    var _t = this;
    let auth = _t.handle_obj('get_key', 'session');
    let key = CryptoJS.MD5(auth.usuario.id + '_' + auth.usuario.email).toString();
    let token = _t._d(auth.token, key);
    token = _t._c(token + '.' + moment().format('YYYY-MM-DD_HH:mm:ss'), key);
    return {
      token: token,
      idu: auth.usuario.id
    }
  },

  _serializedToObj(serializedObj) {
    var obj = new Object();
    for (let i of serializedObj) {
      obj[i['name']] = i['value'];
    }
    return obj;
  },

  login: function (user, pass) {
    let _t = this;
    $.ajax({
      url: _t.host + `?func=login&user=${user}&pass=${pass}`,
      method: 'get',
      success: function (res) {
        var ret = JSON.parse(res.trim());
        
        if (ret.erro === false && ret.logado === true) {
          var obj = new Object();
          obj.logado = true;
          obj.token = ret.token;
          obj.usuario = ret.usuario;
          _t.handle_obj('set_key', 'session', obj);
          location.href = 'home.html';
        }
      }
    });
  },

  cad_cliente: function (cliente) {
    var _t = this;
    var auth = _t._token();

    $.ajax({
      url: _t.host,
      method: 'post',
      data: {
        func: 'cad_cliente',
        obj: _t._serializedToObj(cliente),
        auth
      },
      success: function (res) {
        console.log(res);
        res = JSON.parse(res.trim());
        if (res.erro === false) {

          

        } else {
          console.log(res);
        }
      }
    });
  }

  
}

// quando for enviar algo para a api, pegar o token real (descriptografar), colocar a data e criptografar novamente, entao enviar. ao receber, o token deve bater;