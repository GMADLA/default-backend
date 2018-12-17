$(function() {
    $('.new-top-section').addClass('new-top-section-dynamic');
});

$('#adult_button').on("click", function(event) {
    event.preventDefault();

    var currentContainer = $(this).parents('.new-main-form-holder');
    var newContainer = $('#adult_form');
    var currentHeading = '#adult_or_child_form .new-main-form-titles-holder h1';
    var newHeading = '#adult_form .new-main-form-titles-holder h1';

    choosenumTransition(currentContainer, newContainer, currentHeading, newHeading);

    $('#product').val('adult');

    var selection = $('#adult_form .app-selection-js').val();
    $('#appnum').val(selection);
});

$('#child_button').on('click', function(event) {
    event.preventDefault();

    var currentContainer = $(this).parents('.new-main-form-holder');
    var newContainer = $('#child_form');
    var currentHeading = '#adult_or_child_form .new-main-form-titles-holder';
    var newHeading = '#child_form .new-main-form-titles-holder';

    choosenumTransition(currentContainer, newContainer, currentHeading, newHeading);

    $('#product').val('child');

    var selection = $('#child_form .app-selection-js').val();
    $('#appnum').val(selection);
});

$('.new-main-form-container').on('click', '#adult_back_button, #child_back_button', function(event) {
    event.preventDefault();

    var isAdultBackButton = $(this).is('#adult_back_button');

    var currentContainer = $(this).parents('.new-main-form-holder');
    var newContainer = $('#adult_or_child_form');
    if (isAdultBackButton) {
        var currentHeading = '#adult_form .new-main-form-titles-holder h1';
        var newHeading = '#adult_or_child_form .new-main-form-titles-holder h1';
    }
    else {
        var currentHeading = '#child_form .new-main-form-titles-holder';
        var newHeading = '#adult_or_child_form .new-main-form-titles-holder';
    }

    choosenumTransition(currentContainer, newContainer, currentHeading, newHeading);
});

/**
 * Transitions form containers.
 *
 * @param  jQuery   currentContainer
 *   jQuery object to be hidden.
 * @param  jQuery   newContainer
 *   jQuery object to be shown.
 * @param  string   currentHeading
 *   Current heading selector.
 * @param  string   newHeading
 *   New heading selector.
 *
 * @return void
 */
var choosenumTransition = function(currentContainer, newContainer, currentHeading, newHeading) {
    $(currentHeading).addClass('transitioned').delay(200)
    .queue(function() {
        currentContainer.addClass("transitioned");
        $(this).dequeue();
    }).delay(200)
    .queue(function() {
        currentContainer.addClass("hidden");
        newContainer.removeClass('hidden');
        $(this).dequeue();
    }).delay(200)
    .queue(function() {
        newContainer.removeClass('transitioned');
        $(newHeading).removeClass('transitioned');
        $(this).dequeue();
    });
};


$('.new-main-form-container').on('click', '.app-selection-js', function(event) {
    var selection = $(this).val();
    $('#appnum').val(selection);
});

$('.new-main-form-container').on('click', '#submit_child, #submit_adult', function(event) {
    // Hide photo.
    $('.new-main-section-holder').addClass('submitted');

    $('#AppForm').submit();
});