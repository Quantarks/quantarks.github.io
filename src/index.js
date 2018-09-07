"use strict"

document.onreadystatechange = () => {
    document
        .querySelector('body')
        .innerHTML += '<a href="#to-top" class="to-top"></a>'

    document
        .querySelector('body')
        .setAttribute('id', 'to-top')
}