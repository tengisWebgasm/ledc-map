
var handleMapClick = (event) => {
    if (selectEnd.value) {
        selectEnd.value = '';
        closeDestination();
    } else if (selectStart.value) {
        selectStart.value = '';
        closeSelection();
    }
}

var initialCityOptions;

var handleCityClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!initialCityOptions) {
        initialCityOptions = [...document.querySelectorAll("#city-select-start>select>option:not([value=''])")].map(node => node.getAttribute("value"))
    }

    if (selectStart.value === '') {
        // no cities selected initially

        // if city not in whitelist
        if (!initialCityOptions.includes(event.currentTarget.id)) {
            return;
        }

        if (selectStart.value === event.currentTarget.id) {
            selectStart.value = '';
            closeSelection();
        } else {
            selectStart.value = event.currentTarget.id;
            showSelection(event.currentTarget.id);
        }
    } else {
        // initial city selected

        if (selectStart.value === event.currentTarget.id) {
            selectStart.value = '';
            closeSelection();
        } else {
            selectEnd.value = event.currentTarget.id;
            selectDestination(event.currentTarget.id);
        }
    }
}