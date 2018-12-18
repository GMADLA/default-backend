// JavaScript Document
$('.nav-sub-nav-holder > h4').click( function(event) {
    $(this).parents('.nav-sub-nav-holder').toggleClass('active');
    $('.nav-sub-nav-holder').not( $(this).parents('.nav-sub-nav-holder') ).removeClass('active');
});

$('.bottom-links-section-holder > div > h3').click( function() {
    $(this).parent().toggleClass('active');
    $('.bottom-links-section-holder > div').not( $(this).parent() ).removeClass('active');
});

function toggleMenu() {
    // $('#top-main-menu').toggle();
    $('#top-main-menu').toggleClass('hideMenu');
    $('.showHideMenu').toggle();
}

$('.top-menu-3bars').click( function() { toggleMenu() });
$('.showHideMenu').click( function() { toggleMenu() });

$('.form-product-checkboxes').click( function() {
    var thisBoxChecked = false;
    if ( $(this).hasClass('form-product-checked') ) {
        $(this).removeClass('form-product-checked');
    } else {
        thisBoxChecked = true;
        $(this).addClass('form-product-checked');
    }

    $('.form-product-checkboxes').not( $(this) ).removeClass('form-product-checked');

    var thisId = $(this).attr('id');
    if (thisId == 'combo_product') {
        $('#InquiryForm_adult').prop( 'checked', thisBoxChecked );
        $('#InquiryForm_juvenile').prop( 'checked', thisBoxChecked );
    }
    else if (thisId == 'child_whole_product') {
        $('#InquiryForm_juvenile').prop( 'checked', thisBoxChecked );
        $('#InquiryForm_adult').prop( 'checked', false );
    }
    else  { /* adult_term_product */
        $('#InquiryForm_adult').prop( 'checked', thisBoxChecked );
        $('#InquiryForm_juvenile').prop( 'checked', false );
    }
});

$('.inquire_form_input_row > input').focus( function() {
    $(this).parent().addClass('active-field');
    $(this).blur( function() {
        $(this).parent().removeClass('active-field');
        if ( $(this).val() == '' || $(this).val() == null ) {
            $(this).parent().removeClass('text-entered');
        }
    });

}).keydown( function() {
    $(this).parent().addClass('text-entered');
});

$(document).ready(function() {
    $('.inquire_form_input_row > input').each( function() {
        if ( $(this).val() != '' ) {
            $(this).parent().addClass('text-entered');
        }
    });
    $('.inquire_form_input_row > select').each( function() {
        if ( $(this).val() != '' ) {
            $(this).parent().addClass('text-entered');
        }
    });

    if ($('#inquire_form_submit').hasClass('show')) {
        $('.main-form-holder').addClass('show-full-form');
    }

    var adultCheckboxChecked = $('#InquiryForm_adult').prop( 'checked' );
    var childCheckboxChecked = $('#InquiryForm_juvenile').prop( 'checked' );

    if ( adultCheckboxChecked && childCheckboxChecked ) {

        $('#combo_product').addClass('form-product-checked');
    } else if (adultCheckboxChecked) {
        $('#adult_term_product').addClass('form-product-checked');
    } else if (childCheckboxChecked) {
        $('#child_whole_product').addClass('form-product-checked');
    }
});

$("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});

$(window).scroll(function(e){
    parallax();
});
