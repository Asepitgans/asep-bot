let fetch = require('node-fetch')
let util = require('util')
let handler = async (m, {
  text
}) => {
  if (!/^https?:\/\//.test(text)) return m.reply('Awali *URL* dengan http:// atau https://')
  let _url = new URL(text)
  let url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY')
  let res = await fetch(url)
  if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
    delete res
    return m.reply(`Content-Length: ${res.headers.get('content-length')}`)
  }
  if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, '', text, m)
  let txt = await res.buffer()
  try {
    txt = util.format(JSON.parse(txt + ''))
  } catch (e) {
    txt = txt + ''
  } finally {
    m.reply(txt.slice(0, 65536) + '')
  }
}
handler.help = ['fetch'].map((v) => v + '')
handler.tags = ['internet']
handler.command = ['fetch', 'get']
module.exports = handler