$(document).ready(function() {
    var productSlider = function() {
        var slideTimer;
        var hwTimeOut = 5000;
        var index = 0;

        var slide = function () {
            index = index < 3 ? index + 1 : 0;
            animSlide(index);
            slideTimer = setTimeout(slide, hwTimeOut);
        };

        var animSlide = function (index) {
            $('.product-slide li.active').removeClass('active');
            $('.product-slide li:eq(' + index + ')').addClass('active');
            $('.control-slide').removeClass('active');
            $('.control-slide:eq(' + index + ')').addClass('active');
        };

        $('.control-slide').click(function (e) {
            index = parseFloat($(this).text());
            animSlide(index);
            clearTimeout(slideTimer);
        });

        $('.control-slide, .product-slide').on('mouseenter', function (e) {
            clearTimeout(slideTimer);
        });

        $('.control-slide, .product-slide').on('mouseleave', function (e) {
            slideTimer = setTimeout(slide, hwTimeOut);
        });

        slideTimer = setTimeout(slide, hwTimeOut);
    };

    var advantagesSlider = function() {
        var slideTimer;
        var hwTimeOut = 8000;
        var index = 0;

        var slide = function () {
            index = index < 1 ? index + 1 : 0;
            animSlide(index);
            slideTimer = setTimeout(slide, hwTimeOut);
        };

        var animSlide = function (index) {
            $('.advantages-slide li.active').removeClass('active');
            $('.advantages-slide li:eq(' + index + ')').addClass('active');
        };

        $('.advantage').on('mouseenter', function (e) {
            clearTimeout(slideTimer);
        });

        $('.advantage').on('mouseleave', function (e) {
            slideTimer = setTimeout(slide, hwTimeOut);
        });

        slideTimer = setTimeout(slide, hwTimeOut);
    };

    productSlider();
    advantagesSlider();

});
