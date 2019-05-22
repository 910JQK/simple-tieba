import 'whatwg-fetch'
import router from './router'
import Loading from '@/assets/img-loading.gif'


var Title = {}
var Scroll = {}
var ScrollCallback = null


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


function on_scroll (callback) {
    let view = window.document.querySelector('.md-app-scroller')
    if (ScrollCallback != null) {
        view.removeEventListener('scroll', ScrollCallback)
    }
    if (callback != null) {
        ScrollCallback = ev => {
            if (view.scrollTop > 0.5) {
                callback((view.scrollTop+view.offsetHeight)/view.scrollHeight)
            }
        }
        view.addEventListener('scroll', ScrollCallback)
    } else {
        ScrollCallback = null
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


function normalize_link (link, push) {
    let extract = link.href.match(/src=([^&]+)/)[1]
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
            child.tagName == 'img'
            && child.src.startsWith('http://tb2.bdstatic.com/tb/editor/images/')
        ) {
            child.className = 'emoticon'
            push(child)
        } else if (
            typeof child.href == 'string'
            && child.href.startsWith('http://gate.baidu.com')
        ) {
            normalize_link(child, push)
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


function normalize_finf_content (finf, push) {
    let children = Array.from(finf.childNodes)
    let first = children[0]
    let first_content = first? first.textContent: ''
    if (first_content.match(/^回复 ?$/) != null) {
        children.shift()
    } else if (first_content.match(/^回复[^：:]*[：:]/) != null) {
        first.textContent = first.textContent.replace(/^[^：:]*[：:]/, '')
    }
    let end = finf.querySelector('br+a')
    let prev = ''
    for (let child of children) {
        if (
            child.tagName == 'img'
            && child.src.startsWith('http://tb2.bdstatic.com/tb/editor/images/')
        ) {
            child.className = 'emoticon'
            push(child)
        } else if (
            typeof child.href == 'string'
            && child.href.startsWith('http://gate.baidu.com')
        ) {
            normalize_link(child, push)
            prev = 'link'
        } else if (
            prev == 'reply' && child.nodeValue
            && child.nodeValue.match(/^ :/) != null
        ) {
            child.nodeValue = child.nodeValue.replace(/^ :/, '')
            push(child)
        } else if (child.tagName == 'br') {
            continue
        } else if (child === end) {
            break
        } else if (
            typeof child.href == 'string'
            && child.href.match(/\/i\?un=/) != null
        ) {
            let id_raw = child.href.match(/\/i\?un=(.*)/)[1]
            let id = decodeURIComponent(id_raw)
            child.href = 'javascript:void(0)'  // TODO: profile page
            child.className = 'finf-reply'
            child.style.color = get_color(child.textContent)
            child.textContent = `@${id}`
            push(child)
            prev = 'reply'
        } else {
            push(child)
            prev = ''
        }
    }
}


function get_color (string) {
    let M = 359
    let x = 1237
    let y = 1759
    let z = 2333
    for (let rune of string) {
        let t = rune.codePointAt(0)
        y = (((y + t*7) % M)*t + x) % M
        z = (((z + t*11) % M)*t + y) % M
        x = (((x + t*13) % M)*t + z) % M
    }
    let H = x % 359
    let S = 60 + y % 37
    let L = 20 + z % 13
    return `hsl(${H}, ${S}%, ${L}%)`
}


export {
    parse, set_title, recover_title, save_scroll, restore_scroll, on_scroll, normalize_content, normalize_finf_content, get_color
}
