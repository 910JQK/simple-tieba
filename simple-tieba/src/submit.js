import { encode_query, parse } from './tools'
import router from './router'


const FAKE_UA = (
    'Mozilla/5.0 (Android 7.1.1; Mobile; rv:67.0) Gecko/67.0 Firefox/67.0'
)

let SubmitInfo = {}


function get_submit_info (key) {
    return SubmitInfo[key] || null
}


function extract_submit_info (document, referrer, key_) {
    let key = key_ || router.currentRoute.query.VNK
    let form = document.querySelector('form[method=post]')
    let match = form.action.match(/mo\/([^\/]+)\//)
    let magic = match? match[1]: 'm'
    let url = `https://tieba.baidu.com/mo/${magic}/submit`
    let fields = Array.from(form.querySelectorAll('input[name]'))
    let need_remove = new Set(['insert_smile', 'insert_pic'])
    let data = {}
    for (let field of fields) {
        if (!need_remove.has(field.name)) {
            data[field.name] = field.value
        }
    }
    let name = router.currentRoute.name
    let params = router.currentRoute.params
    let go_back = f => {
        router.back()
        setTimeout(() => {
            if (!f) {
                router.replace({ name, params, query: { t: Math.random() } })
            } else {
                f()
            }
        }, 500)
    }
    let info = { data, url, go_back, referrer }
    SubmitInfo[key] = info
    return info
}


function submit (info, data_override, success, callback) {
    if (info === null) { return }
    let VNK = router.currentRoute.query.VNK
    let data = Object.assign({}, info.data, data_override)
    let body = encode_query(data)
    ;(async () => {
        let res = await fetch(info.url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': FAKE_UA
            }),
            referrerPolicy: 'unsafe-url',
            referrer: info.referrer,
            body: body
        })
        let text = await res.text()
        let document = parse(text)
        let t = document.querySelector('span.light')
        if (router.currentRoute.query.VNK == VNK) {
            let f = callback(Boolean(t && t.textContent == success))
            info.go_back(f)
        }
    })()
}


export { get_submit_info, extract_submit_info, submit }
