let left = true;
let pos1, pos2, pos3, pos4 = 0;

const dc = 'albury';
const city = 'dubbo';
const line = document.querySelector(`path[dc="${dc}"][city="${city}"]`);
[...document.querySelectorAll(`path[dc="${dc}"]`)].forEach(line => {
    line.style.opacity = '0.3';
})
line.style.opacity = '1';

const toggleLeft = document.querySelector('[toggle-left]');
const toggleRight = document.querySelector('[toggle-right]');
const nodeLeft = document.querySelector('[left-node]');
const nodeRight = document.querySelector('[right-node]');

toggleLeft.addEventListener('mousedown', e => {
    left = true;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
});
toggleRight.addEventListener('mousedown', e => {
    left = false;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
});

function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;

    const dString = line.getAttribute('d').replaceAll(',', ' ').replaceAll('M', '').replaceAll('C', ' ');
    let [px, py, qx, qy, rx, ry, sx, sy] = dString.split(/[ ]{1,}/);

    if (left) {
        qx = Math.round((qx - pos1 / 20) * 1000) / 1000;
        qy = Math.round((qy - pos2 / 20) * 1000) / 1000;
    } else {
        rx = Math.round((rx - pos1 / 20) * 1000) / 1000;
        ry = Math.round((ry - pos2 / 20) * 1000) / 1000;
    }
    line.setAttribute('d', `M${px},${py} C${qx},${qy} ${rx},${ry} ${sx},${sy}`);
    nodeLeft.setAttribute('cx', qx);
    nodeLeft.setAttribute('cy', qy);
    nodeRight.setAttribute('cx', rx);
    nodeRight.setAttribute('cy', ry);
}

function closeDragElement() {
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
    console.log(line);
    console.log(line.getAttribute('d'));
}