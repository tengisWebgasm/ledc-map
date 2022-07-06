// const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

/**
 * Initialize panzoom
 */
const elem = document.getElementById('map-element');
const panzoom = Panzoom(elem, {
    startX: -90,
    startY: -80,
    startScale: 1,
    minScale: 0.5,
});

var mapBtnZoomIn = document.getElementById("map-btn-zoom-in");
var mapBtnZoomOut = document.getElementById("map-btn-zoom-out");
var mapBtnReset = document.getElementById("map-btn-zoom-reset");
var mapPingContent = document.getElementById("map-ping-content");

/**
 * Zoom in and out, and reset
 */
mapBtnZoomIn.addEventListener("click", function(){
    panzoom.zoomIn();
});
mapBtnZoomOut.addEventListener("click", function(){
    panzoom.zoomOut();
});
mapBtnReset.addEventListener("click", function(){
    panzoom.reset();
})

/**
 * When zooming, make map ping panel change scale based on zoom level.
 */
elem.addEventListener("panzoomzoom", function(e){
    mapPingContent.style.transform = `scale(${1/e.detail.scale})`;
});
elem.addEventListener("panzoomreset", function(e) {
    mapPingContent.style.transform = `scale(${1/e.detail.scale})`;
})

/**
 * Differentiate between click and drag through variable isDraggedMap
 */
 var isDraggedMap = false;
 
elem.addEventListener("panzoomstart", function(){
    isDraggedMap = false;
})

elem.addEventListener("panzoompan", function(){
    isDraggedMap = true;
})

elem.addEventListener("click", function(e){
	if (!isDraggedMap)
        handleMapClick();
})