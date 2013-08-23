$(document).ready(function() {

	// Aside menu

	$('.aside ul').on('click', 'li', function(e){
	    e.stopPropagation();
	    $('.aside ul li').removeClass('active');
	    $(this).addClass('active');
	});

});