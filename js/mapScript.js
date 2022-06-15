const vw = Math.max(
	document.documentElement.clientWidth || 0,
	window.innerWidth || 0
);
var mapElement = document.getElementById("map-element");
var sidePanel = document.getElementById("map-side-panel");
var sidePanelB = document.getElementById("map-side-panel-b");
var selectStartCont = document.getElementById("city-select-start");
var selectEndCont = document.getElementById("city-select-end");
var selectStart = selectStartCont.querySelector("select");
var selectEnd = selectEndCont.querySelector("select");
var carrierWrapperLeft = document
	.getElementsByClassName("map-side-panel__carriers-wrapper")
	.item(0);
var carrierWrapperRight = document
	.getElementsByClassName("map-side-panel__carriers-wrapper")
	.item(1);
var pingPanel = document.getElementById("map-ping-panel");
var pingPanelDc = pingPanel.querySelector('[city-label="dc"]');
var pingPanelCt = pingPanel.querySelector('[city-label="destination"]');
var pingPanelContent = document.getElementById("map-ping-content");
var pingPanelButton = document.getElementById("map-ping-button");

// function called when some starting point (data center) is selected
function showSelection(cityName) {
	// adjust display of dropdowns
	selectStartCont.setAttribute("active", "");
	selectEnd.removeAttribute("disabled");
	selectEndCont.removeAttribute("disabled");

	// get data about starting point from json
	const curEndpoints = Object.keys(datacenterDetails[cityName].endpoint); // valid city endpoints of the data center

	// display the lines and city
	[...document.querySelectorAll(`.city-group`)].forEach((group) => {
		if (group.id === cityName) group.setAttribute("dc", "");
		else group.removeAttribute("dc");

		if (group.id === cityName || curEndpoints.includes(group.id))
			group.setAttribute("on", "");
		else group.removeAttribute("on");
	});
	try {
		[
			...document.querySelector("[city-lines]").querySelectorAll("path"),
		].forEach((e) => e.removeAttribute("on"));
		[...document.querySelectorAll(`[dc="${cityName}"], [city="${cityName}"]`)].forEach((e) => {
			setTimeout(() => e.setAttribute("on", ""), Math.random() * 280);
		});
	} catch {}

	// adjust display of destination dropdown to highlight available cities
	[...selectEnd.querySelectorAll("option")].forEach((opt) => {
		if (curEndpoints.includes(opt.value) || !opt.value)
			opt.removeAttribute("disabled");
		else opt.setAttribute("disabled", "");
	});

	// adjust ping display for the datacenter to (selected?) global city
	if (curEndpoints.includes(selectEnd.value))
		selectDestination(selectEnd.value);
	else {
		selectEnd.value = "";
		selectEndCont.removeAttribute("active");
		// destinationDetails.setAttribute('off', '');
		[...document.querySelectorAll("[dc][city]")].forEach((e) =>
			e.removeAttribute("selected")
		);
		pingPanel.removeAttribute("active");
	}

	// hide left and right arrows if less than or equal to 6 carriers in city
	if (vw > 767) {
		if (datacenterDetails[cityName]["carriers"].length <= 6) {
			hideArrowButtons(0);
			document.getElementsByClassName("map-side-panel__carriers-wrapper").item(0).style.justifyContent = "center";
		} else {
			showArrowButtons(0);
			document.getElementsByClassName("map-side-panel__carriers-wrapper").item(0).style.justifyContent = "flex-start";
		}
	}

	// expand menu
	// if (!expanded && vw > 767) {
	//     expandMenu();
	// }

	// change carriers
	handleCarriersChange(0, cityName);

	// change learn more link and datasheet city name/link
	var learnMoreLink = document.getElementsByClassName("map__ping-city-link").item(0);
	var downloadDataSheetBtn = document.getElementsByClassName("map-side-panel__download-button").item(0);
	var capitalizedName = document.getElementById(cityName).getElementsByClassName("city-name").item(0).innerHTML;
	learnMoreLink.href = "/dc_location/" + cityName + "/";
	downloadDataSheetBtn.innerHTML = capitalizedName;
}

var closeSelection = () => {
	// telcoContainer.removeAttribute('on');
	selectStartCont.removeAttribute("active");
	selectEnd.value = "";
	selectEnd.setAttribute("disabled", "");
	selectEndCont.setAttribute("disabled", "");
	[
		...document.querySelector("[city-lines]").querySelectorAll("path"),
	].forEach((e) => e.removeAttribute("on"));
	[...document.querySelectorAll(`.city-group`)].forEach((group) => {
		if (Object.keys(datacenterDetails).includes(group.id))
			group.setAttribute("dc", "");
		group.removeAttribute("on");
	});

	// hide menu
	if (expanded) {
		expandMenu();
	}
	
	// change download data sheet button text to "Select a city"
	var downloadDataSheetBtn = document.getElementsByClassName("map-side-panel__download-button").item(0);
	downloadDataSheetBtn.innerHTML = "Select a city";

	closeDestination();
};

function selectDestination(cityName) {
	selectEndCont.setAttribute("active", "");
	// destinationDetails.removeAttribute('off');
	[...document.querySelectorAll("[dc][city]")].forEach((e) =>
		e.removeAttribute("selected")
	);

	// add dc to selected destination city to make it highlighted
	let otherCities = document.querySelectorAll(
		"g.city-group:not(#" + selectStart.value + ")"
	);
	for (let i = 0; i < otherCities.length; i++) {
		otherCities[i].removeAttribute("dc");
	}
	document.querySelector("#" + cityName).setAttribute("dc", "");

	// set other lines invisible
	let otherLines = document.querySelectorAll(
		`[city-lines]`
	);
	for (let i = 0; i < otherLines.length; i++) {
		let dcFilter = otherLines[i].getAttribute("dc")
		let cityFilter = otherLines[i].getAttribute("cityFilter")
		if (!(dcFilter === selectStart.value && cityFilter === cityName) 
			&& !(cityFilter === selectStart.value && dcFilter === cityName)) {
			otherLines[i].setAttribute("invisible", "");
		}
	}

	const curLine = document.querySelector(
		`[dc="${selectStart.value}"][city="${cityName}"],
		[city="${selectStart.value}"][dc="${cityName}"]`
	);
	curLine.setAttribute("selected", "");

	const dString = curLine
		.getAttribute("d")
		.replaceAll(",", " ")
		.replaceAll("M", "")
		.replaceAll("C", " ");
	const [px, py, qx, qy, rx, ry, sx, sy] = dString.split(/[ ]{1,}/);

	function getMidPoint(p, q, r, s) {
		return (
			(parseFloat(p) +
				3 * parseFloat(q) +
				3 * parseFloat(r) +
				parseFloat(s)) /
			8
		);
	}
	const [anchorX, anchorY] = [
		getMidPoint(px, qx, rx, sx),
		getMidPoint(py, qy, ry, sy),
	];

	const rootSVG = document.querySelector("#map-element svg");
	const point = rootSVG.createSVGPoint();
	let matrix, position;

	matrix = curLine.getCTM();
	point.x = anchorX;
	point.y = anchorY;
	position = point.matrixTransform(matrix);

	pingPanel.style.left = position.x + "px";
	pingPanel.style.top = position.y - 20 + "px";

	changeText(
		pingPanelDc,
		selectStart.options[selectStart.selectedIndex].label
	);
	changeText(pingPanelCt, selectEnd.options[selectEnd.selectedIndex].label);
	changePing(
		document.querySelector("#map-ping-panel-ping"),
		`${parseInt(
			datacenterDetails[selectStart.value].endpoint[cityName].ping
		)}`
	);
	pingPanel.setAttribute("active", "");

	// change carriers
	handleCarriersChange(1, cityName);

	// hide left and right arrows if less than or equal to 6 carriers in city
	if (vw > 767) {
		if (datacenterDetails[cityName]["carriers"].length <= 6) {
			hideArrowButtons(1);
			document.getElementsByClassName("map-side-panel__carriers-wrapper").item(1).style.justifyContent = "center";
		} else {
			showArrowButtons(1);
			document.getElementsByClassName("map-side-panel__carriers-wrapper").item(1).style.justifyContent = "flex-start";
		}
	}

	// expand menu
	if (!expanded) {
		expandMenu();
	}

	// change learn more link and datasheet city name/link
	var learnMoreLink = document.getElementsByClassName("map__ping-city-link").item(1);
	var downloadDataSheetBtn = document.getElementsByClassName("map-side-panel__download-button").item(1);
	var capitalizedName = document.getElementById(cityName).getElementsByClassName("city-name").item(0).innerHTML;
	learnMoreLink.href = "/dc_location/" + cityName + "/";
	downloadDataSheetBtn.innerHTML = capitalizedName;
}

var closeDestination = () => {
	selectEndCont.removeAttribute("active");
	if (selectStart.value)
		document
			.querySelectorAll("g.city-group:not(#" + selectStart.value + ")")
			.forEach((e) => e.removeAttribute("dc"));
	// destinationDetails.setAttribute('off', '');
	[...document.querySelectorAll("[dc][city]")].forEach((e) =>
		e.removeAttribute("selected")
	);

	[...document.querySelectorAll(`[city-lines] path[invisible]`)].forEach(
		(e) => e.removeAttribute("invisible")
	);
	pingPanel.removeAttribute("active");
	
	// change download data sheet button text to "Select a city"
	var downloadDataSheetBtn = document.getElementsByClassName("map-side-panel__download-button").item(1);
	downloadDataSheetBtn.innerHTML = "Select a city";
};

selectStart.addEventListener("change", () => {
	if (selectStart.value) {
		showSelection(selectStart.value);
	} else {
		closeSelection();
	}
});

selectEnd.addEventListener("change", () => {
	if (selectEnd.value) {
		selectDestination(selectEnd.value);
	} else {
		closeDestination();
	}
});

// listen for pingpanel going off the page
let prvRight = parseInt(pingPanelContent.getBoundingClientRect().right);
setInterval(() => {
	if (parseInt(pingPanelContent.getBoundingClientRect().right) != prvRight) {
		prvRight =
			parseInt(pingPanelContent.getBoundingClientRect().right) || 0;
		marginLeft = parseInt(pingPanelContent.style.marginLeft) || 0;
		mapBounds = parseInt(mapElement.getBoundingClientRect().right);
		if (prvRight - marginLeft > mapBounds) {
			pingPanelContent.style.marginLeft =
				mapBounds - prvRight + marginLeft + "px";
		} else {
			pingPanelContent.style.marginLeft = "";
		}
		pingPanelButton.style.marginRight = pingPanelContent.style.marginLeft;
	}
}, 20);

/**
 *  Expand side panel menu on expand btn click
 */
var expanded = false;
var expandIcon = sidePanel.querySelector(".expand-icon");
var sidePanelBMaxHeight = vw > 767 ? "500px" : "60vh";
var expandOverlay = document.getElementById("map-side-panel-overlay");

function expandMenu() {
	if (expanded) {
		sidePanelB.style.maxHeight = "0px";
		expandIcon.style.transform = "rotate(0deg)";
		expanded = false;
		expandOverlay.style.visibility = "hidden";
		expandOverlay.style.opacity = 0;
		if (vw > 767) {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	} else if (selectStart.value !== "" || selectEnd.value !== "") {
		sidePanelB.style.maxHeight = sidePanelBMaxHeight;
		expandIcon.style.transform = "rotate(180deg)";
		if (vw > 767){
			window.scrollTo({
				top:
					sidePanel.offsetTop -
					sidePanel.scrollTop +
					sidePanel.clientTop -
					200,
				behavior: "smooth",
			});
		}
		expanded = true;
		expandOverlay.style.visibility = "visible";
		expandOverlay.style.opacity = 0.6;
	}
}

/**
 * Carrier nav buttons click handlers. Scrolls left or right
 * @param {*} carriersWrapperIndex 0 for left side carriers, 1 for right side carriers
 */

function carrierScrollLeft(carriersWrapperIndex) {
	var wrapper =
		carriersWrapperIndex <= 0 ? carrierWrapperLeft : carrierWrapperRight;
	var scrollWidth = wrapper
		.getElementsByClassName("service-item")
		.item(0).clientWidth;
	wrapper.scroll({
		left: wrapper.scrollLeft - scrollWidth,
		behavior: "smooth",
	});
}

function carrierScrollRight(carriersWrapperIndex) {
	var wrapper =
		carriersWrapperIndex <= 0 ? carrierWrapperLeft : carrierWrapperRight;
	var scrollWidth = wrapper
		.getElementsByClassName("service-item")
		.item(1).clientWidth;
	wrapper.scroll({
		left: wrapper.scrollLeft + scrollWidth,
		behavior: "smooth",
	});
}

// Attach events to buttons
var carrierNavButtonsLeft = document.getElementsByClassName(
	"carriers-nav-btn left"
);
var carrierNavButtonsRight = document.getElementsByClassName(
	"carriers-nav-btn right"
);
try {
	carrierNavButtonsLeft.item(0).addEventListener("click", function () {
		carrierScrollLeft(0);
	});
	carrierNavButtonsRight.item(0).addEventListener("click", function () {
		carrierScrollRight(0);
	});
	carrierNavButtonsLeft.item(1).addEventListener("click", function () {
		carrierScrollLeft(1);
	});
	carrierNavButtonsRight.item(1).addEventListener("click", function () {
		carrierScrollRight(1);
	});
} catch (e) {
	console.error(e);
}

/**
 * Event handler for when a carrier is clicked
 *
 * @param {*} e Click event object
 * @param {*} carriersWrapperIndex 0 for left side, 1 for right side carrier.
 */
// function handleCarrierClick(e, carriersWrapperIndex) {
//     // determine if wrapper is on left or right side
//     var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
//     var wrapper = document.getElementsByClassName("map-side-panel__carriers-wrapper").item(leftRightSide);
//     var cloudWrapper = document.getElementsByClassName("map-side-panel__cloud-wrapper").item(leftRightSide);
//     var cloudProviders = document.getElementsByClassName("cloud-wrapper").item(leftRightSide);

//     if (e.currentTarget.getAttribute("active") === ""){
//         // if cilcked carrier is already active - hide the msp section

//         e.currentTarget.removeAttribute("active");

//         // hide cloud wrapper
//         cloudWrapper.style.maxHeight = '0px';
//         setTimeout(function(){cloudWrapper.style.display = 'none';}, 400)
//     } else {
//         // if clicked carrier is not already active

//         // remove active from all on click
//         [...wrapper.getElementsByClassName("service-item")].forEach(function(el){
//             el.removeAttribute("active");
//         });
//         e.currentTarget.setAttribute("active", "");

//         // filter cloud providers
//         var selectedCloudProviders = carrierCloudProviders[e.currentTarget.getAttribute("carrier")];
//         if (selectedCloudProviders.length <= 0) {
//             // if the selected carrier has no public cloud providers, hide providers wrapper
//             cloudProviders.style.maxHeight = '0px';
//         } else {
//             cloudProviders.style.maxHeight = '150px';
//             [...cloudProviders.getElementsByClassName("cloud-provider")].forEach(function(cloudEl) {
//                 if (selectedCloudProviders.includes(cloudEl.getAttribute("cloud"))) {
//                     // if cloud provider is in selected list
//                     cloudEl.style.display = 'block';
//                 } else {
//                     cloudEl.style.display = 'none';
//                 }
//             })
//         }

//         // set cloud wrapper max height to 400px
//         cloudWrapper.style.display = 'block';
//         setTimeout(function(){cloudWrapper.style.maxHeight = '300px';}, 10);
//     }
// }

function handleCarriersChange(carriersWrapperIndex, cityName) {
	// determine if wrapper is on left or right side
	var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
	var carrierWrapper = document
		.getElementsByClassName("map-side-panel__carriers-wrapper")
		.item(leftRightSide);
	var mspWrapper = document
		.getElementsByClassName("map-side-panel__msp-wrapper msp-wrapper")
		.item(leftRightSide);
	var cityDetails = datacenterDetails[cityName];

	// hide carriers that aren't in the selected city
	[...carrierWrapper.getElementsByClassName("service-item")].forEach(
		function (carrierEl) {
			if (
				cityDetails["carriers"].includes(
					carrierEl.getAttribute("carrier")
				)
			) {
				carrierEl.style.display = "block";
			} else {
				carrierEl.style.display = "none";
			}
		}
	);

	// hide msp providers that aren't in the selected city
	[...mspWrapper.getElementsByClassName("msp-provider")].forEach(function (
		mspEl
	) {
		if (cityDetails["msps"].includes(mspEl.getAttribute("provider"))) {
			mspEl.style.display = "block";
		} else {
			mspEl.style.display = "none";
		}
	});
}

function hideArrowButtons(carriersWrapperIndex) {
	// determine if wrapper is on left or right side
	var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
	var networkTopDiv = document
		.getElementsByClassName("map-side-panel__network-top")
		.item(leftRightSide);
	[...networkTopDiv.getElementsByClassName("carriers-nav-btn")].forEach(
		function (btn) {
			btn.style.display = "none";
		}
	);
}

function showArrowButtons(carriersWrapperIndex) {
	// determine if wrapper is on left or right side
	var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
	var networkTopDiv = document
		.getElementsByClassName("map-side-panel__network-top")
		.item(leftRightSide);
	[...networkTopDiv.getElementsByClassName("carriers-nav-btn")].forEach(
		function (btn) {
			btn.style.display = "block";
		}
	);
}

// [...document.getElementsByClassName("map-side-panel__carriers-wrapper")
//     .item(0)
//     .getElementsByClassName("service-item")]
//     .forEach(function(btn){
//         btn.addEventListener("click", function(e){
//             e.stopPropagation();
//             e.preventDefault();

//             handleCarrierClick(e, 0);
//         });
//     });

// [...document.getElementsByClassName("map-side-panel__carriers-wrapper")
//     .item(1)
//     .getElementsByClassName("service-item")]
//     .forEach(function(btn){
//         btn.addEventListener("click", function(e){
//             e.stopPropagation();
//             e.preventDefault();

//             handleCarrierClick(e, 1)
//         });
//     });
