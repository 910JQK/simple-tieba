import GBK from 'gbk.js'


function get_avatar_url (user_name, callback) {
    let un = GBK.URI.encodeURIComponent(user_name)
    ;(async () => {
        let res = await fetch(
            `https://tieba.baidu.com/i/sys/user_json?un=${un}`
        )
        let json = await res.json()
        let portrait = json.creator.portrait || null
        if (portrait != null) {
            let url = (
                `http://tb.himg.baidu.com/sys/portrait/item/${portrait}`
            )
            callback(url)
        }
    })()
}


function get_bar_avatar_url (kw, callback) {
    ;(async () => {
        kw = encodeURIComponent(kw)
        let res = await fetch(`http://tieba.baidu.com/suggestion?query=${kw}`)
        let json = await res.json()
        let fpic = json.query_match.search_data[0].fpic
        let match = fpic.match(/\/([^\/]+)$/)
        let file = match[1]
        let net_url = `http://imgsrc.baidu.com/forum/pic/item/${file}`
        let res1 = await fetch(net_url, {
            referrerPolicy: 'no-referrer'
        })
        let blob = await res1.blob()
        let url = URL.createObjectURL(blob)
        callback(url)
    })()
}


export { get_avatar_url, get_bar_avatar_url }
