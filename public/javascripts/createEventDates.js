$(document).ready(() => {
    // set up event dates selector
    $('#chooseEventDatesSelector').datetimepicker({
        allowMultidate: true,
        multidateSeparator: ',',
        format: 'L'
    });

    let eventDates = [];
    let eventDatesCalendarIsOpen = false;
    let eventDatesTableHTML = ``;

    $("#chooseEventDatesButton").click((e) => {
        eventDatesCalendarIsOpen = !eventDatesCalendarIsOpen; // open/close calendar window
        if ((eventDates.length > 0) && eventDatesCalendarIsOpen) { // if there are event dates and the calendar is opened, reset all dates
            $("#eventDatesTableWrap").addClass('hidden');
            eventDates = [];
            eventDatesTableHTML = ``;
            $(e.target).removeClass('btn-warning');
            $(e.target).addClass('btn-success');
            $(e.target).html('Done');
        } else if (eventDatesCalendarIsOpen) { // if the calendar is opened for the first time
            $(e.target).removeClass('btn-info');
            $(e.target).addClass('btn-success');
            $(e.target).html('Done');
        } else { // dates (or new dates) have been selected
            $(e.target).removeClass('btn-success');
            $(e.target).addClass('btn-warning');
            $(e.target).html('Reset Dates');
            const datesInput = $("#chooseEventDatesInput").val().split(','); // get dates from dates input
            datesInput.map((date, i) => {
                eventDates.push({ // create date objects for eventDates array
                    i,
                    date
                });
                eventDatesTableHTML += `
                    <tr>
                        <td>
                            <p><strong>${date}</strong></p>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="openEventLot-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#openEventLot-${i}"/>
                                <div class="input-group-append" data-target="#openEventLot-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-clock"></i></div>
                                </div>
                            </div>
                            <script>
                                $('#openEventLot-${i}').datetimepicker({
                                    format: 'LT'
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="closeEventLot-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#closeEventLot-${i}"/>
                                <div class="input-group-append" data-target="#closeEventLot-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-clock"></i></div>
                                </div>
                            </div>
                            <script>
                                $('#closeEventLot-${i}').datetimepicker({
                                    format: 'LT'
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="startEventLotSales-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#startEventLotSales-${i}"/>
                                <div class="input-group-append" data-target="#startEventLotSales-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                            <script>
                                $(function () {
                                    $('#startEventLotSales-${i}').datetimepicker({
                                        defaultDate: moment()
                                    });
                                });
                            </script>
                        </td>
                        <td>
                            <div class="input-group input-group-sm date" id="endEventLotSales-${i}" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-toggle="datetimepicker" data-target="#endEventLotSales-${i}"/>
                                <div class="input-group-append" data-target="#endEventLotSales-${i}" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                            <script>
                                $(function () {
                                    $('#endEventLotSales-${i}').datetimepicker({
                                        defaultDate: moment('${date}').format("MM-DD-YYYY") + " 11:59 PM"
                                    });
                                });
                            </script>
                        </td>
                    </tr>
                `
            });
            $("#eventDatesTable").html(eventDatesTableHTML);
            $("#eventDatesTableWrap").removeClass('hidden');
        }
    });




});  