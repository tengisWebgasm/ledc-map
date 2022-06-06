// const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const elem = document.getElementById('map-element');
const panzoom = Panzoom(elem, {
    startX: -90,
    startScale: 1.1
});