// Google Places autocomplete
new google.maps.places.Autocomplete(
(document.getElementById('lotAddress')), {
    types: ['geocode']
});


$(document).ready(() => {

    // Image uplading
    $(document).on('change', '.btn-file :file', function() {
        let input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });
    $('.btn-file :file').on('fileselect', (event, label) => {
        let input = $(this).parents('.input-group').find(':text'),
            log = label;
        if (input.length) {
            input.val(log);
        }
    });
    const readURL = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#img-upload').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imgInp").change(() => {
        readURL(this);
        $("#img-upload").removeClass('hidden');
        $("#uploadBtn").removeClass('btn-info');
        $("#uploadBtn").addClass('btn-warning');
        $("#uploadBtnText").html(`<span class="fa fa-pencil-alt"></span> Change`);
    });
    

    // lot type 24h/specific-dates switcher
    $("input[name=parkingType]").on("change", function() {
        const switchTo = $(this).val();
        if(switchTo === 'specificDatesParking') {
            $("#chooseDatesSelectorWrap").removeClass("hidden");
            $("#datesOptions").removeClass("hidden");
        } else {
            $("#chooseDatesSelectorWrap").addClass("hidden");
            $("#datesOptions").addClass("hidden");
            $("#datesTableWrap").addClass("hidden");
        }
    });


    // edit all/each spaces switcher
    $("input[name=allEachSelector]").on("change", function() {
        const switchTo = $(this).val();
        if(switchTo === 'all') {
            $("#editAllSpaces").removeClass('hidden');
            $("#editEachSpace").addClass('hidden');
        } else {
            $("#editAllSpaces").addClass('hidden');
            $("#editEachSpace").removeClass('hidden');
        }
   });



});


