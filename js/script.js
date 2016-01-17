$(document).ready(function() {

  // Aside menu

  $('.aside ul').on('click', 'li', function( event ){
      event.stopPropagation();
      $('.aside ul li').removeClass('active');
      $(this).addClass('active');
  });
});
