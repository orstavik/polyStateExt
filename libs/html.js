function html(str, ...values) {
    let res = '';
    str.forEach((item, i) => {
        let value = values[i] || '';
        res += (item+value);
    });
    return docFragment(res);
}

function docFragment(str) {
    const temp = document.createElement('template');
    temp.innerHTML = str;
    return temp.content;
}