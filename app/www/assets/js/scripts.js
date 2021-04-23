function toggleBackdrop() {
  var b = $('.backdrop');
  if (b.length) {
    b.fadeOut(300, () => {
      b.remove();
    });
    return true;
  } else {
    b = $('<div class="backdrop" style="display: none"></div>').appendTo('#app');
    b.fadeIn(300);
    return false;
  }
}

function toggleMenu() {
  var menu = $('.sidebar');
  var b = toggleBackdrop();
  if (b == false) {
    setTimeout(() => {
      menu.toggleClass('show');
      $('#app').find('.backdrop').click(function () {
        toggleMenu();
      })
    }, 300);
  } else {
    menu.toggleClass('show');
  }
}

function setPage(file) {
  var content = $('#load_content');
  if (content.attr('data-file') != file) {
    var new_content;
    $.get(file, {}, function (html) {
      new_content = `<div id="hidden_content">${html}</div>`;
      new_content = $(new_content).appendTo('#app #load_content');
      setTimeout(() => {
        new_content.addClass('show');
      }, 100);
      setTimeout(() => {
        $('#loaded').remove();
        new_content.attr('id', 'loaded');
        events();
      }, 500);
    });
  }
}

function events() {
  $('#btnMenuToggle').on('click', function () {
    toggleMenu();
  });

  $('#btnLogout').on('click', function () {
    toggleMenu();
    setTimeout(() => {
      location.href = 'index.html';
    }, 300);
  })

  $('a').on('click', function (e) {
    e.preventDefault();
    let page = $(this).attr('href');
    setPage(page);
  })
}

$(document).ready(function () {
  events();
});