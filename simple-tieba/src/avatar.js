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


export { get_avatar_url }
