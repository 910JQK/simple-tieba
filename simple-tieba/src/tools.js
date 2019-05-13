import 'whatwg-fetch'
import router from './router'
import Loading from '@/assets/img-loading.gif'


var Title = {}
var Scroll = {}


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


function save_scroll (key) {
    let view = window.document.querySelector('.md-app-scroller')
    if (view != null) {
        Scroll[key] = view.scrollTop
    }
}


function restore_scroll (key) {
    if (Scroll[key]) {
        let view = window.document.querySelector('.md-app-scroller')
        if (view != null) {
            view.scrollTop = Scroll[key]
        }
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


function normalize_content (floor, push) {
    let children = Array.from(floor.childNodes)
    children.pop()
    let first = children[0]
    if (first && first.nodeValue) {
        first.nodeValue = first.nodeValue.replace(/^[0-9]+楼\. /, '')
    }
    let last = children[children.length-1]
    if (last && last.tagName == 'br') {
        children.pop()
    }
    let prev = ''
    for (let child of children) {
        if (
            child.querySelector
            && child.querySelector('.BDE_Image') != null
        ) {
            let extract = child.href.match(/src=([^&]+)/)[1]
            let real_src = decodeURIComponent(extract)
            push(display_image(real_src))
            prev = 'img'
        } else if (
            typeof child.href == 'string'
            && child.href.startsWith('http://gate.baidu.com')
        ) {
            let extract = child.href.match(/src=([^&]+)/)[1]
            let real_href = decodeURIComponent(extract)
            let match = real_href.match(/\/p\/([0-9]+)/)
            if (match != null) {
                let kz = match[1]
                let a = window.document.createElement('a')
                a.href = 'javascript:void(0)'
                a.onclick = () => {
                    router.push({ name: 'thread', params: {kz} })
                }
                a.textContent = kz
                push(a)
            } else {
                let a = window.document.createElement('a')
                a.href = real_href
                a.target = '_blank'
                a.textContent = real_href
                a.addEventListener('click', ev => {
                    ev.preventDefault()
                    try {
                        cordova.InAppBrowser.open (
                            ev.target.href,
                            '_system',
                            'location=yes'
                        );
                    } catch (e) {
                        console.log (
                            'failed to open link by cordova-plugin-inappbrowser'
                        )
                    }
                })
                push(a)
            }
            prev = 'link'
        } else if (child.className == 'reply_to') {
            continue
        } else if (child.nodeValue ==  '\u00a0') {
            console.log('skip')
            continue
        } else if (child.tagName == 'br' && prev == 'img') {
            continue
        } else {
            push(child)
            prev = ''
        }
    }
}


export {
    parse, set_title, recover_title, save_scroll, restore_scroll, normalize_content
}
