var Title = {}


function parse (xml_text) {
    return (new DOMParser()).parseFromString(xml_text, 'application/xml')
}


function set_title (text, key) {
    let title_bar = document.querySelector('#title')
    if (title_bar) {
        title_bar.textContent = text
        if (key) {
            Title[key] = text
        }
    }
}


function recover_title (key) {
    if (Title[key]) {
        set_title(Title[key])
    }
}


export { parse, set_title, recover_title }
