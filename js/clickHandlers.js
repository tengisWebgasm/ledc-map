
var handleMapClick = (event) => {
    if (selectEnd.value) {
        selectEnd.value = '';
        closeDestination();
    } else if (selectStart.value) {
        selectStart.value = '';
        closeSelection();
    }
}

var handleCityClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.currentTarget.hasAttribute('dc')) {
        if (selectStart.value === event.currentTarget.id) {
            selectStart.value = '';
            closeSelection();
        } else {
            selectStart.value = event.currentTarget.id;
            showSelection(event.currentTarget.id);
        }
    } else {
        selectEnd.value = event.currentTarget.id;
        selectDestination(event.currentTarget.id);
    }
}