var alphabetArray = " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ|()".split("");

async function changeText(el, newText) {
    if (el.innerHTML === newText) return;
    const textChangeId = parseInt(el.getAttribute('text-change-id') || 0) + 1;
    el.setAttribute('text-change-id', textChangeId);

    const clear = setInterval(interval, 5);

    function interval() {
        if (el.getAttribute('text-change-id') != textChangeId || el.innerHTML === newText) {
            if (el.innerHTML === newText) el.removeAttribute('text-change-id');
            clearInterval(clear);
        }
        const textArr = [];
        for (let i = 0; i < newText.length; i++) {
            if (!el.innerHTML[i]) textArr[i] = Math.floor(Math.random() * alphabetArray.length);
            else if (el.innerHTML[i] === newText[i]) textArr[i] = alphabetArray.indexOf(el
                .innerHTML[i]);
            else textArr[i] = alphabetArray.indexOf(el.innerHTML[i]) + (alphabetArray.indexOf(el
                .innerHTML[i]) < alphabetArray.indexOf(newText[i]) ? 1 : -1);
        }
        const newArr = textArr.map(e => alphabetArray[e]);
        el.innerHTML = newArr.join('');
    }
}

async function changePing(el, newPing) {
    if (parseInt(el.innerHTML) === parseInt(newPing)) return;
    const textChangeId = parseInt(el.getAttribute('text-change-id') || 0) + 1;
    el.setAttribute('text-change-id', textChangeId);

    const clear = setInterval(interval, 80);

    function interval() {
        if (el.getAttribute('text-change-id') != textChangeId || parseInt(el.innerHTML) ===
            parseInt(newPing)) {
            if (parseInt(el.innerHTML) === parseInt(newPing)) el.removeAttribute('text-change-id');
            clearInterval(clear);
        }
        const textArr = [];
        for (let i = 0; i < newPing.length; i++) {
            if (isNaN(parseInt(el.innerHTML[i]))) textArr[i] = Math.floor(Math.random() * 10 + 1);
            else if (el.innerHTML[i] === newPing[i]) textArr[i] = alphabetArray.indexOf(el
                .innerHTML[i]);
            else textArr[i] = alphabetArray.indexOf(el.innerHTML[i]) + (alphabetArray.indexOf(el
                .innerHTML[i]) < alphabetArray.indexOf(newPing[i]) ? 1 : -1);
        }
        const newArr = textArr.map(e => alphabetArray[e]);
        el.innerHTML = newArr.join('') + 'ms^';
    }
}