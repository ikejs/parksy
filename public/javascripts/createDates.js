$(document).ready(() => {
    // set up dates selector
    $('#chooseDatesSelector').datetimepicker({
        allowMultidate: true,
        multidateSeparator: ',',
        format: 'L'
    });

    let dates = [];
    let datesCalendarIsOpen = false;
    let datesTableHTML = ``;

    $("#chooseDatesButton").click((e) => {
        datesCalendarIsOpen = !datesCalendarIsOpen; // open/close calendar window
        if ((dates.length > 0) && datesCalendarIsOpen) { // if there are dates and the calendar is opened, reset all dates
            $("#datesTableWrap").addClass('hidden');
            dates = [];
            datesTableHTML = ``;
            $(e.target).removeClass('btn-warning');
            $(e.target).addClass('btn-success');
            $(e.target).html('Done');
        } else if (datesCalendarIsOpen) { // if the calendar is opened for the first time
            $(e.target).removeClass('btn-info');
            $(e.target).addClass('btn-success');
            $(e.target).html('Done');
        } else { // dates (or new dates) have been selected
            $(e.target).removeClass('btn-success');
            $(e.target).addClass('btn-warning');
            $(e.target).html('Reset Dates');
            const datesInput = $("#chooseDatesInput").val().split(','); // get dates from dates input
            datesInput.map((date, i) => {
                dates.push({ // create date objects for dates array
                    i,
                    date
                });
                datesTableHTML += `
                    <tr>
                        <td>
                            <p><strong>${date}</strong></p>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="openLot-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#openLot-${i}"/>
                                <div class="input-group-append" data-target="#openLot-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-clock"></i></div>
                                </div>
                            </div>
                            <script>
                                $('#openLot-${i}').datetimepicker({
                                    format: 'LT'
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="closeLot-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#closeLot-${i}"/>
                                <div class="input-group-append" data-target="#closeLot-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-clock"></i></div>
                                </div>
                            </div>
                            <script>
                                $('#closeLot-${i}').datetimepicker({
                                    format: 'LT'
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="startLotSales-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#startLotSales-${i}"/>
                                <div class="input-group-append" data-target="#startLotSales-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                            <script>
                                $(function () {
                                    $('#startLotSales-${i}').datetimepicker({
                                        defaultDate: moment()
                                    });
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="endLotSales-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#endLotSales-${i}"/>
                                <div class="input-group-append" data-target="#endLotSales-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                            <script>
                                $(function () {
                                    $('#endLotSales-${i}').datetimepicker({
                                        defaultDate: moment('${date}').format("MM-DD-YYYY") + " 11:59 PM"
                                    });
                                });
                            </script>
                        </td>
                    </tr>
                `
            });
            $("#datesTable").html(datesTableHTML);
            $("#datesTableWrap").removeClass('hidden');
        }
    });




});  