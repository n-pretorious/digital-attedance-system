/* off-canvas sidebar toggle */
$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
    $('span.collapse').toggleClass('in');
});

$('[data-toggle=offcanvas-in]').click(function() {
    $('.row-offcanvas').addClass('active');
    $('span.collapse').addClass('in');
});