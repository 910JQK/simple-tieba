function parse (xml_text) {
    return (new DOMParser()).parseFromString(xml_text, 'application/xml')
}


function set_title (text) {
    let title_bar = document.querySelector('#title')
    if (title_bar) {
        title_bar.textContent = text
    }
}


export { parse, set_title }
