let spaces = [];
let timeLimitTypeHoursSelected = true;
let timeLimitTypeMinutesSelected = false;
let spacesTableHTML = ``;
const updateSpacesTable = () => {
    spaces = [];
    let numberOfSpaces = parseInt($("#numberOfSpaces").val());
    let pricePerSpace = parseInt($("#spacePrice").val());
    let timeMinimumPerSpace = parseInt($("#spaceTimeMinimum").val());
    let timeLimitPerSpace = parseInt($("#spaceTimeLimit").val());
    let timeMinimumType = 'hours';
    let timeLimitType = 'hours';

    if ($("#lotSpaceTimeMinimumType").val() === "hours") {
        timeMinimumTypeHoursSelected = true;
        timeMinimumTypeMinutesSelected = false;
        timeMinimumType = 'hours';
    } else {
        timeMinimumTypeMinutesSelected = true;
        timeMinimumTypeHoursSelected = false;
        timeMinimumType = 'minutes';
    }

    if ($("#lotSpaceTimeLimitType").val() === "hours") {
        timeLimitTypeHoursSelected = true;
        timeLimitTypeMinutesSelected = false;
        timeLimitType = 'hours';
    } else {
        timeLimitTypeMinutesSelected = true;
        timeLimitTypeHoursSelected = false;
        timeLimitType = 'minutes';
    }

    spacesTableHTML = ``;
    for(i=1; i < numberOfSpaces + 1; i+=1) {
        spaces.push({ // create space objects for spaces array
            price: pricePerSpace,
            min: timeMinimumPerSpace,
            minType: timeMinimumType,
            max: timeLimitPerSpace,
            maxType: timeLimitType
        });
        spacesTableHTML += `
            <tr>
                <th>${i}</th>
                <td>
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm">$</span>
                        </div>
                        <input type="text" class="form-control" aria-label="$" aria-describedby="inputGroup-sizing-sm" placeholder="0.00" value="${pricePerSpace}">
                    </div>
                </td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="0" value="${timeMinimumPerSpace}" />
                        <div class="input-group-append input-group-sm col-md-6 p-0">
                            <select class="custom-select custom-select-lg btn btn-outline-secondary btn-sm dropdown-toggle">
                                <option value="hours" ${(() => { if (timeMinimumTypeHoursSelected) return 'selected' })()}>hours</option>
                                <option value="minutes" ${(() => { if (timeMinimumTypeMinutesSelected) return 'selected' })()}>minutes</option>
                            </select>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="0" value="${timeLimitPerSpace}" />
                        <div class="input-group-append input-group-sm col-md-6 p-0">
                            <select class="custom-select custom-select-lg btn btn-outline-secondary btn-sm dropdown-toggle">
                                <option value="hours" ${(() => { if (timeLimitTypeHoursSelected) return 'selected' })()}>hours</option>
                                <option value="minutes" ${(() => { if (timeLimitTypeMinutesSelected) return 'selected' })()}>minutes</option>
                            </select>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }
    $("#spacesTable").html(spacesTableHTML);
}


$("#numberOfSpaces").on("input", function() {
    updateSpacesTable();
});

$("#spacePrice").on("input", function() {
    updateSpacesTable();
});

$("#lotSpaceTimeMinimumType").on("input", function() {
    updateSpacesTable();
});

$("#spaceTimeMinimum").on("input", function() {
    console.log($(this).val());
    updateSpacesTable();
});

$("#lotSpaceTimeLimitType").on("input", function() {
    updateSpacesTable();
});

$("#spaceTimeLimit").on("input", function() {
    updateSpacesTable();
});