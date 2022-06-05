// const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
if (vw <= 767) {
    const elem = document.getElementById('map-element');
    const panzoom = Panzoom(elem, {
        startX: -90,
        maxScale: 5
    });
}