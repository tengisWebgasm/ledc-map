const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
var mapElement = document.querySelector('#map-element');
var sidePanel = document.querySelector("#map-side-panel");
var selectStartCont = document.querySelector("#city-select-start");
var selectEndCont = document.querySelector("#city-select-end");
var selectStart = selectStartCont.querySelector('select');
var selectEnd = selectEndCont.querySelector('select');
// var destinationDetails = document.querySelector("#city-destination-details");
var carrierWrapperLeft = document.getElementsByClassName("map-side-panel__carriers-wrapper").item(0);
var carrierWrapperRight = document.getElementsByClassName("map-side-panel__carriers-wrapper").item(1);
var pingPanel = document.querySelector('#map-ping-panel');
var pingPanelDc = pingPanel.querySelector('[city-label="dc"]');
var pingPanelCt = pingPanel.querySelector('[city-label="destination"]');
// var pingPanelBtnDc = pingPanel.querySelector('button[city-label="dc"]');
// var pingPanelBtnCt = pingPanel.querySelector('button[city-label="destination"]');
// var telcoContainer = document.querySelector('#map-side-panel-b');
// var telcoBlock = document.querySelector('#telco-block');
// var separatorBlock = document.querySelector('#telco-separator')
// var providersBlock = document.querySelector('#providers-block');
// var providerCloudContent = document.querySelector('#providers-block-content');

// var netFabricBlock = document.querySelector('#net-fabric-block');
var pingPanelContent = pingPanel.querySelector('#map-ping-content');
var pingPanelButton = pingPanel.querySelector('#map-ping-button');

// function called when some starting point (data center) is selected
var showSelection = (cityName) => {
    // adjust display of dropdowns
    selectStartCont.setAttribute('active', '');
    selectEnd.removeAttribute('disabled');
    selectEndCont.removeAttribute('disabled');

    // get data about starting point from json
    const curEndpoints = Object.keys(datacenterDetails[cityName]
        .endpoint); // valid city endpoints of the data center
    // const datacentres = Object.keys(datacenterDetails); // all datacentres
    // const curPartners = Object.keys(datacenterDetails[cityName][
    //     'telco-partners'
    // ]); // telco partners of the data center
    // const curProvidersSet = new Set(Object.values(datacenterDetails[cityName]['telco-partners'])
    //     .reduce((acc, cur) => [...acc, ...cur], [])); // cloud providers of the data center
    // const curFabrics = Object.keys(datacenterDetails[cityName][
    //     'network-fabric'
    // ]); // fabric partners of the data center
    // const curFabricsSet = new Set(Object.values(datacenterDetails[cityName]['network-fabric'])
    //     .reduce((acc, cur) => [...acc, ...cur], [])); // fabric providers of the data center
    // const curProviders = [...curProvidersSet];

    // display the lines and city
    [...document.querySelectorAll(`.city-group`)].forEach(group => {
        if (group.id === cityName) group.setAttribute('dc', '');
        else group.removeAttribute('dc');

        if (group.id === cityName || curEndpoints.includes(group.id)) group.setAttribute(
            'on', '');
        else group.removeAttribute('on');
    });
    try {
        [...document.querySelector('[city-lines]').querySelectorAll('path')].forEach(e => e
            .removeAttribute('on'));
        [...document.querySelectorAll(`[dc="${cityName}"]`)].forEach(e => {
            setTimeout(() => e.setAttribute('on', ''), Math.random() * 280);
        });
    } catch { }

    // adjust display of destination dropdown to highlight available cities 
    [...selectEnd.querySelectorAll('option')].forEach(opt => {
        if (curEndpoints.includes(opt.value) || !opt.value) opt.removeAttribute('disabled');
        else opt.setAttribute('disabled', '');
    })

    // adjust ping display for the datacenter to (selected?) global city
    if (curEndpoints.includes(selectEnd.value)) selectDestination(selectEnd.value);
    else {
        selectEnd.value = '';
        selectEndCont.removeAttribute('active');
        // destinationDetails.setAttribute('off', '');
        [...document.querySelectorAll('[dc][city]')].forEach(e => e.removeAttribute('selected'));
        pingPanel.removeAttribute('active');
    }

    // change carriers
    handleCarriersChange(0, cityName);

    // show the data center telco partners
    // adjustTelcoPartnerDisplay(curPartners);

    // account for previously selected telco partner
    // if (curPartners.includes(telcoBlock.getAttribute('active-partner'))) {
    //     const prvProviders = datacenterDetails[cityName]['telco-partners'][telcoBlock.getAttribute(
    //         'active-partner')];
    //     adjustCloudProviderDisplay(prvProviders);
    // } else {
    //     // turn off any active selections on telco partner button
    //     [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(partner => {
    //         partner.removeAttribute('active');
    //     });

    //     // remove the active attribute
    //     telcoBlock.removeAttribute('active-partner');

    //     // show the data center's relevant cloud provideers
    //     adjustCloudProviderDisplay(curProviders);
    // }

    // // show the data center fabric partners
    // adjustFabricPartnerDisplay(curFabrics);

    // // display the panel
    // telcoContainer.setAttribute('on', '');
}

var closeSelection = () => {
    // telcoContainer.removeAttribute('on');
    selectStartCont.removeAttribute('active');
    selectEnd.value = '';
    selectEnd.setAttribute('disabled', '');
    selectEndCont.setAttribute('disabled', '');
    [...document.querySelector('[city-lines]').querySelectorAll('path')].forEach(e => e
        .removeAttribute('on'));
    [...document.querySelectorAll(`.city-group`)].forEach(group => {
        if (Object.keys(datacenterDetails).includes(group.id)) group.setAttribute('dc', '');
        group.removeAttribute('on');
    });

    // [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(partner => {
    //     partner.removeAttribute('active');
    // });
    closeDestination();
}

var selectDestination = (destName) => {
    selectEndCont.setAttribute('active', '');
    // destinationDetails.removeAttribute('off');
    [...document.querySelectorAll('[dc][city]')].forEach(e => e.removeAttribute('selected'));

    // add dc to selected destination city to make it highlighted
    let otherCities = document.querySelectorAll('g.city-group:not(#' + selectStart.value + ')')
    for (let i=0; i<otherCities.length; i++) {
        otherCities[i].removeAttribute('dc');
    }
    document.querySelector("#" + destName).setAttribute("dc", '');

    // set other lines invisible
    let otherLines = document.querySelectorAll(`[city-lines] path:not([city="${destName}"]):not([dc="${selectStart.value}"])`);
    for (let i=0; i<otherLines.length; i++) {
        otherLines[i].setAttribute('invisible', '');
    }

    const curLine = document.querySelector(`[dc="${selectStart.value}"][city="${destName}"]`);
    curLine.setAttribute('selected', '');

    const dString = curLine.getAttribute('d').replaceAll(',', ' ').replaceAll('M', '').replaceAll(
        'C', ' ');
    const [px, py, qx, qy, rx, ry, sx, sy] = dString.split(/[ ]{1,}/);

    function getMidPoint(p, q, r, s) {
        return (parseFloat(p) + 3 * parseFloat(q) + 3 * parseFloat(r) + parseFloat(s)) / 8;
    }
    const [anchorX, anchorY] = [getMidPoint(px, qx, rx, sx), getMidPoint(py, qy, ry, sy)];

    const rootSVG = document.querySelector('#map-element svg');
    const point = rootSVG.createSVGPoint();
    let matrix, position;

    matrix = curLine.getCTM();
    point.x = anchorX;
    point.y = anchorY;
    position = point.matrixTransform(matrix);

    pingPanel.style.left = position.x + 'px';
    pingPanel.style.top = position.y - 20 + 'px';

    changeText(pingPanelDc, selectStart.options[selectStart.selectedIndex].label);
    changeText(pingPanelCt, selectEnd.options[selectEnd.selectedIndex].label);
    // changeText(pingPanelBtnDc, selectStart.options[selectStart.selectedIndex].label);
    // changeText(pingPanelBtnCt, selectEnd.options[selectEnd.selectedIndex].label);
    changePing(document.querySelector('#map-ping-panel-ping'),
        `${parseInt(datacenterDetails[selectStart.value].endpoint[destName].ping)}`);
    // changePing(document.querySelector('#ping-display'),
    //     `${parseInt(datacenterDetails[selectStart.value].endpoint[destName].ping)}`);
    pingPanel.setAttribute('active', '');

    // change carriers
    handleCarriersChange(1, cityName);
}

var closeDestination = () => {
    selectEndCont.removeAttribute('active');
    if (selectStart.value)
        document.querySelectorAll('g.city-group:not(#' + selectStart.value + ')').forEach(e => e.removeAttribute('dc'));
    // destinationDetails.setAttribute('off', '');
    [...document.querySelectorAll('[dc][city]')].forEach(e => e.removeAttribute('selected'));
    
    [...document.querySelectorAll(`[city-lines] path[invisible]`)].forEach(e => e.removeAttribute('invisible'));
    pingPanel.removeAttribute('active');
}

selectStart.addEventListener('change', () => {
    if (selectStart.value) {
        showSelection(selectStart.value);
    } else {
        closeSelection();
    }
});

selectEnd.addEventListener('change', () => {
    if (selectEnd.value) {
        selectDestination(selectEnd.value);
    } else {
        closeDestination();
    }
});

// click on telco block container to remove all choices
// telcoBlock.addEventListener('click', e => {
//     if (e.currentTarget === telcoBlock) {
//         turnOffTelcoSelection();
//     }
// });

// var turnOffTelcoSelection = () => {
//     // turn off active selection on telco partner button
//     [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(partner => {
//         partner.removeAttribute('active');
//     });
//     // remove the active attribute
//     telcoBlock.removeAttribute('active-partner');
//     // show all current providers
//     const curProvidersSet = new Set(Object.values(datacenterDetails[selectStart.value][
//         'telco-partners'
//     ]).reduce((acc, cur) => [...acc, ...cur], [])); // cloud providers of the data center
//     const curProviders = [...curProvidersSet];
//     adjustCloudProviderDisplay(curProviders);
// }

// add click event listneners for each telco partner block
// [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(block => {
//     block.addEventListener('click', (e) => {
//         e.stopPropagation();
//         if (e.currentTarget.hasAttribute('active')) {
//             turnOffTelcoSelection();
//             return;
//         }

//         telcoBlock.setAttribute('active-partner', e.currentTarget.getAttribute(
//             'telco-partner'));
//         [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(partner => {
//             partner.removeAttribute('active');
//         });
//         e.currentTarget.setAttribute('active', '');

//         const curProviders = datacenterDetails[selectStart.value]['telco-partners'][e
//             .currentTarget.getAttribute('telco-partner')
//         ];
//         adjustCloudProviderDisplay(curProviders);
//     });
// });

// helper function to adjust the telco partners which are shown
// var adjustTelcoPartnerDisplay = (showPartners) => {
//     // get current positions of blocks to show 
//     const prvBlockPositions = showPartners.map(partnerName => {
//         const block = telcoBlock.querySelector(`[telco-partner="${partnerName}"]`);
//         let rect;
//         if (!block) console.error(`Unfound: [telco-partner="${partnerName}"]`);
//         else rect = block.getBoundingClientRect();
//         return {
//             block: block,
//             prvX: rect.x,
//             prvY: rect.y,
//             shouldAnimate: block.hasAttribute('show'),
//         }
//     });

//     // turn on/off displays of blocks
//     [...telcoBlock.querySelectorAll('[telco-partner]')].forEach(partner => {
//         partner.style.transition = '';
//         showPartners.includes(partner.getAttribute('telco-partner')) ? partner.setAttribute(
//             'show', '') : partner.removeAttribute('show');
//     });

//     // adjust positions of blocks
//     prvBlockPositions.forEach(pos => {
//         const curRect = pos.block.getBoundingClientRect();
//         pos.block.style.left = parseInt(pos.prvX) - parseInt(curRect.x) + 'px';
//         pos.block.style.top = parseInt(pos.prvY) - parseInt(curRect.y) + 'px';
//     });

//     // flush styling and set all positions to 0
//     setTimeout(() => {
//         prvBlockPositions.forEach(pos => {
//             if (pos.shouldAnimate) pos.block.style.transition =
//                 'left ease 200ms, top ease 200ms';
//             pos.block.offsetTop;
//             pos.block.style.left = '0px';
//             pos.block.style.top = '0px';
//         });
//     }, 0);

//     // adjust collapser
//     if (showPartners.length > 6) {
//         const collapser = telcoBlock.querySelector('.service-container-collapse');
//         const numCollapsing = showPartners.length - 6;
//         collapser.setAttribute('numCollapsing', numCollapsing);
//         if (collapser.innerHTML == "Show less") return;
//         collapser.innerHTML = `Show more (${numCollapsing})`;
//         telcoBlock.querySelector('.service-container').setAttribute('collapsed', '');
//     } else {
//         telcoBlock.querySelector('.service-container-collapse').removeAttribute('numCollapsing');
//     }
// }

// // helper function to adjust the cloud providers which are shown
// var adjustCloudProviderDisplay = (showProviders) => {
//     if (!showProviders.length) { // we are not showing any providers
//         providersBlock.setAttribute('placeholder', 'on');
//         return;
//     }
//     // get current positions of blocks to show 
//     const prvBlockPositions = showProviders.map(providerName => {
//         const block = providersBlock.querySelector(`[cloud-provider="${providerName}"]`);
//         const rect = block.getBoundingClientRect();
//         return {
//             block: block,
//             prvX: rect.x,
//             prvY: rect.y,
//             shouldAnimate: block.hasAttribute('show'),
//         }
//     });
//     // turn on/off displays of blocks
//     [...providersBlock.querySelectorAll('[cloud-provider]')].forEach(provider => {
//         provider.style.transition = '';
//         showProviders.includes(provider.getAttribute('cloud-provider')) ? provider
//             .setAttribute('show', '') : provider.removeAttribute('show');
//     });
//     // adjust positions of blocks
//     prvBlockPositions.forEach(pos => {
//         const curRect = pos.block.getBoundingClientRect();
//         pos.block.style.left = parseInt(pos.prvX) - parseInt(curRect.x) + 'px';
//         pos.block.style.top = parseInt(pos.prvY) - parseInt(curRect.y) + 'px';
//     });
//     providersBlock.setAttribute('placeholder', 'off');

//     // flush styling and set all positions to 0
//     setTimeout(() => {
//         prvBlockPositions.forEach(pos => {
//             if (pos.shouldAnimate) pos.block.style.transition =
//                 'left ease 200ms, top ease 200ms';
//             pos.block.offsetTop;
//             pos.block.style.left = '0px';
//             pos.block.style.top = '0px';
//         });
//     }, 0);

//     // adjust collapser
//     if (showProviders.length > 6) {
//         const collapser = providersBlock.querySelector('.service-container-collapse');
//         const numCollapsing = showProviders.length - 6;
//         collapser.setAttribute('numCollapsing', numCollapsing);
//         if (collapser.innerHTML == "Show less") return;
//         collapser.innerHTML = `Show more (${numCollapsing})`;
//         providersBlock.querySelector('.service-container').setAttribute('collapsed', '');
//     } else {
//         providersBlock.querySelector('.service-container-collapse').removeAttribute(
//             'numCollapsing');
//     }
// }

// // helper function to adjust the fabric partners which are shown
// var adjustFabricPartnerDisplay = (showPartners) => {
//     // get current positions of blocks to show 
//     const prvBlockPositions = showPartners.map(partnerName => {
//         const block = netFabricBlock.querySelector(
//             `[net-fabric-provider="${partnerName}"]`);
//         let rect;
//         if (!block) console.error(`Unfound: [net-fabric-provider="${partnerName}"]`);
//         else rect = block.getBoundingClientRect();
//         return {
//             block: block,
//             prvX: rect.x,
//             prvY: rect.y,
//             shouldAnimate: block.hasAttribute('show'),
//         }
//     });

//     // turn on/off displays of blocks
//     [...netFabricBlock.querySelectorAll('[net-fabric-provider]')].forEach(partner => {
//         partner.style.transition = '';
//         showPartners.includes(partner.getAttribute('net-fabric-provider')) ? partner
//             .setAttribute('show', '') : partner.removeAttribute('show');
//     });

//     // adjust positions of blocks
//     prvBlockPositions.forEach(pos => {
//         const curRect = pos.block.getBoundingClientRect();
//         pos.block.style.left = parseInt(pos.prvX) - parseInt(curRect.x) + 'px';
//         pos.block.style.top = parseInt(pos.prvY) - parseInt(curRect.y) + 'px';
//     });

//     // flush styling and set all positions to 0
//     setTimeout(() => {
//         prvBlockPositions.forEach(pos => {
//             if (pos.shouldAnimate) pos.block.style.transition =
//                 'left ease 200ms, top ease 200ms';
//             pos.block.offsetTop;
//             pos.block.style.left = '0px';
//             pos.block.style.top = '0px';
//         });
//     }, 0);

//     // adjust collapser
//     if (showPartners.length > 6) {
//         const collapser = netFabricBlock.querySelector('.service-container-collapse');
//         const numCollapsing = showPartners.length - 6;
//         collapser.setAttribute('numCollapsing', numCollapsing);
//         if (collapser.innerHTML == "Show less") return;
//         collapser.innerHTML = `Show more (${numCollapsing})`;
//         netFabricBlock.querySelector('.service-container').setAttribute('collapsed', '');
//     } else {
//         netFabricBlock.querySelector('.service-container-collapse').removeAttribute(
//             'numCollapsing');
//     }
// }

// listen for click events on both of service container collapsers
// var telcoBlockCollapser = telcoBlock.querySelector('.service-container-collapse');
// var providersBlockCollapser = providersBlock.querySelector('.service-container-collapse');
// telcoBlockCollapser.addEventListener('click', (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (telcoBlockCollapser.innerHTML == "Show less") {
//         telcoBlockCollapser.innerHTML =
//             `Show more (${telcoBlockCollapser.getAttribute('numCollapsing')})`;
//         telcoBlock.querySelector('.service-container').setAttribute('collapsed', '');
//     } else {
//         telcoBlockCollapser.innerHTML = 'Show less';
//         telcoBlock.querySelector('.service-container').removeAttribute('collapsed');
//     }
// });
// providersBlockCollapser.addEventListener('click', (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (providersBlockCollapser.innerHTML == "Show less") {
//         providersBlockCollapser.innerHTML =
//             `Show more (${providersBlockCollapser.getAttribute('numCollapsing')})`;
//         providersBlock.querySelector('.service-container').setAttribute('collapsed', '');
//     } else {
//         providersBlockCollapser.innerHTML = 'Show less';
//         providersBlock.querySelector('.service-container').removeAttribute('collapsed');
//     }
// });

// listen for pingpanel going off the page
let prvRight = parseInt(pingPanelContent.getBoundingClientRect().right);
setInterval(() => {
    if (parseInt(pingPanelContent.getBoundingClientRect().right) != prvRight) {
        prvRight = parseInt(pingPanelContent.getBoundingClientRect().right) || 0;
        marginLeft = parseInt(pingPanelContent.style.marginLeft) || 0;
        mapBounds = parseInt(mapElement.getBoundingClientRect().right);
        if (prvRight - marginLeft > mapBounds) {
            pingPanelContent.style.marginLeft = mapBounds - prvRight + marginLeft + 'px';
        } else {
            pingPanelContent.style.marginLeft = '';
        }
        pingPanelButton.style.marginRight = pingPanelContent.style.marginLeft;
    }
}, 20);

// $(function () {
//     $('#city-select-start select').on('change', function () {
//         let css = $(this).val()
//         if (css == 'wong-chuk-hang' || css == 'kwai-chung') {
//             $('#telco-separator2').show()
//             $('#net-fabric-block').show()
//         } else {
//             $('#telco-separator2').hide()
//             $('#net-fabric-block').hide()
//         }
//     })
// })

/**
 *  Expand side panel menu on expand btn click
 */
var expanded = false;
var expandIcon = sidePanel.querySelector(".expand-icon");
var expandDistance = vw > 767 ? 88 : 148;
var expandOverlay = document.getElementById("map-side-panel-overlay");
function expandMenu() {
    if (expanded) {
        sidePanel.style.transform = 'translateY(-' + expandDistance + 'px)';
        expandIcon.style.transform = 'rotate(0deg)';
        expanded = false;
        expandOverlay.style.visibility = 'hidden';
        expandOverlay.style.opacity = 0;
    } else {
        sidePanel.style.transform = 'translateY(-100%)';
        expandIcon.style.transform = 'rotate(180deg)';
        expanded = true;
        expandOverlay.style.visibility = 'visible';
        expandOverlay.style.opacity = 0.6;
    }
}

/**
 * Carrier nav buttons click handlers. Scrolls left or right
 * @param {*} carriersWrapperIndex 0 for left side carriers, 1 for right side carriers
 */

function carrierScrollLeft(carriersWrapperIndex) {
    var wrapper = carriersWrapperIndex <= 0 ? carrierWrapperLeft : carrierWrapperRight;
    var scrollWidth = wrapper.getElementsByClassName("service-item").item(0).clientWidth;
    wrapper.scroll({
        left: wrapper.scrollLeft - scrollWidth,
        behavior: "smooth",
    });
}
function carrierScrollRight(carriersWrapperIndex) {
    var wrapper = carriersWrapperIndex <= 0 ? carrierWrapperLeft : carrierWrapperRight;
    var scrollWidth = wrapper.getElementsByClassName("service-item").item(1).clientWidth;
    wrapper.scroll({
        left: wrapper.scrollLeft + scrollWidth,
        behavior: "smooth",
    });
}
// Attach events to buttons
var carrierNavButtonsLeft = document.getElementsByClassName("carriers-nav-btn left");
var carrierNavButtonsRight = document.getElementsByClassName("carriers-nav-btn right");
try {
    carrierNavButtonsLeft.item(0).addEventListener("click", function() {
        carrierScrollLeft(0);
    });
    carrierNavButtonsRight.item(0).addEventListener("click", function() {
        carrierScrollRight(0);
    });
    carrierNavButtonsLeft.item(1).addEventListener("click", function() {
        carrierScrollLeft(1)
    });
    carrierNavButtonsRight.item(1).addEventListener("click", function() {
        carrierScrollRight(1)
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
function handleCarrierClick(e, carriersWrapperIndex) {
    // determine if wrapper is on left or right side
    var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
    var wrapper = document.getElementsByClassName("map-side-panel__carriers-wrapper").item(leftRightSide);
    var cloudWrapper = document.getElementsByClassName("map-side-panel__cloud-wrapper").item(leftRightSide);
    var cloudProviders = document.getElementsByClassName("cloud-wrapper").item(leftRightSide);

    if (e.currentTarget.getAttribute("active") === ""){
        // if cilcked carrier is already active - hide the msp section

        e.currentTarget.removeAttribute("active");

        // hide cloud wrapper
        cloudWrapper.style.maxHeight = '0px';
        setTimeout(function(){cloudWrapper.style.display = 'none';}, 400)
    } else {
        // if clicked carrier is not already active

        // remove active from all on click        
        [...wrapper.getElementsByClassName("service-item")].forEach(function(el){
            el.removeAttribute("active");
        });
        e.currentTarget.setAttribute("active", "");

        // filter cloud providers
        var selectedCloudProviders = carrierCloudProviders[e.currentTarget.getAttribute("carrier")];
        if (selectedCloudProviders.length <= 0) {
            // if the selected carrier has no public cloud providers, hide providers wrapper
            cloudProviders.style.maxHeight = '0px';
        } else {
            cloudProviders.style.maxHeight = '150px';
            [...cloudProviders.getElementsByClassName("cloud-provider")].forEach(function(cloudEl) {
                if (selectedCloudProviders.includes(cloudEl.getAttribute("cloud"))) {
                    // if cloud provider is in selected list
                    cloudEl.style.display = 'block';
                } else {
                    cloudEl.style.display = 'none';
                }
            })
        }

        // set cloud wrapper max height to 400px
        cloudWrapper.style.display = 'block';
        setTimeout(function(){cloudWrapper.style.maxHeight = '300px';}, 10);
    }
}

function handleCarriersChange(carriersWrapperIndex, cityName) {
    // determine if wrapper is on left or right side
    var leftRightSide = carriersWrapperIndex > 0 ? 1 : 0;
    var carrierWrapper = document.getElementsByClassName('map-side-panel__carriers-wrapper').item(leftRightSide);
    var mspWrapper = document.getElementsByClassName("map-side-panel__msp-wrapper msp-wrapper").item(leftRightSide);
    var cityDetails = datacenterDetails[cityName];

    // hide carriers that aren't in the selected city
    [...carrierWrapper.getElementsByClassName("service-item")].forEach(function(carrierEl){
        if (cityDetails['carriers'].includes(carrierEl.getAttribute("carrier"))) {
            carrierEl.style.display = 'block';
        } else {
            carrierEl.style.display = 'none';
        }
    });

    // hide msp providers that aren't in the selected city
    [...mspWrapper.getElementsByClassName("msp-provider")].forEach(function(mspEl){
        if (cityDetails['msps'].includes(mspEl.getAttribute("provider"))) {
            mspEl.style.display = 'block';
        } else {
            mspEl.style.display = 'none';
        }
    });
}

[...document.getElementsByClassName("map-side-panel__carriers-wrapper")
    .item(0)
    .getElementsByClassName("service-item")]
    .forEach(function(btn){
        btn.addEventListener("click", function(e){
            e.stopPropagation();
            e.preventDefault();

            handleCarrierClick(e, 0);
        });
    });

[...document.getElementsByClassName("map-side-panel__carriers-wrapper")
    .item(1)
    .getElementsByClassName("service-item")]
    .forEach(function(btn){
        btn.addEventListener("click", function(e){
            e.stopPropagation();
            e.preventDefault();

            handleCarrierClick(e, 1)
        });
    });