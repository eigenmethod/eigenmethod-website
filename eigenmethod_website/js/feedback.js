$(document).ready(function() {
    $('.feedback').on('mouseenter', function () {
        $('.feedback').css({ "background-color": "#fff"});
        $('.feedback').animate({'right': '0px'}, 500);
    });

    $('.feedback').on('mouseleave', function () {
        setTimeout(function () {
            $('.feedback').animate({'right': '-186px'}, 500);
        }, 1500);
        setTimeout(function () {
            $('.feedback').css({ "background-color": "#067DD9"});
        }, 2000);
    });
});

$(document).scroll(function() {
    var y = $(this).scrollTop();

    if (y > 1500) {
      $('.feedback').fadeIn();
    } else {
      $('.feedback').fadeOut();
    }
});