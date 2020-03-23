// Google Places autocomplete
new google.maps.places.Autocomplete(
(document.getElementById('lotAddress')), {
    types: ['geocode']
});


$(document).ready(() => {

    // Image Upload
    $(document).on('change', '.btn-file :file', function() {
        let input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });
    $('.btn-file :file').on('fileselect', function(event, label) {
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
    $("#imgInp").change(function(){
        readURL(this);
        $("#img-upload").removeClass('hidden');
        $("#uploadBtn").removeClass('btn-info');
        $("#uploadBtn").addClass('btn-warning');
        $("#uploadBtnText").html(`<span class="fa fa-pencil-alt"></span> Change`);
    });
    

    // lot type event/everyday switcher
    $("input[name=parkingType]").on("change", function() {
        const switchTo = $(this).val();
        if(switchTo === 'eventParking') {
            $("#eventDates").removeClass('hidden');
            $("#everydayDates").addClass('hidden');
            $("#spaceTimeLimit").addClass('hidden');
        } else {
            $("#eventDates").addClass('hidden');
            $("#everydayDates").removeClass('hidden');
            $("#spaceTimeLimit").removeClass('hidden');
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


