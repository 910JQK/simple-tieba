import Loading from '@/assets/img-loading.gif'


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


function display_image (net_url) {
    let div = window.document.createElement('div')
    div.classList.add('display-image')
    div.classList.add('loading')
    let img = window.document.createElement('img')
    img.src = Loading
    div.appendChild(img)
    ;(async () => {
        let res = await fetch(net_url, {
            referrerPolicy: 'no-referrer'
            //referrer: `http://tieba.baidu.com/p/${kz}`
        })
        let blob = await res.blob()
        let url = URL.createObjectURL(blob)
        img.src = url
        div.classList.remove('loading')
    })()
    return div
}


export { parse, set_title, recover_title, display_image }
