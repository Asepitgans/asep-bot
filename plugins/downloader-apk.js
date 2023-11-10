let handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  try {
    if (command == 'apk') {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'Vpn'))
      m.react('🕐')
      let json = await Func.fetchJson(API('alya', '/api/apk', { q: text }, 'apikey'))
      let pe = `Untuk mendownload aplikasinya, balas pesan ini dengan perintah ${usedPrefix}getapk nomor\n`
      pe += `*Contoh* : ${usedPrefix}getapk 1\n\n`
      json.data.map((v, i) => {
        pe += `*${i + 1}*. ${v.title}\n`
        pe += ` ◦  *Rating* : ${v.rating} ⭐\n`
        pe += ` ◦  *Url* : ${v.url}\n\n`
      })
      pe += global.footer
      m.reply(pe)
    } else if (command == 'getapk') {
      if (!m.quoted) return m.reply(`Balas pesan yang berisi url playstore`)
      let urls = m.quoted.text.match(new RegExp(/(?:https?:\/{2})?(?:w{3}\.)?play.google(?:com)?\.(?:com|be)(?:\/com\?v=|\/)([^\s&]+)/, 'gi'))
      if (!urls) return m.reply(`Mungkin pesan yang kamu reply tidak berisi url playstore.`)
      m.reply(status.wait)
      let json = await Func.fetchJson(API('alya', '/api/apkget', { url: urls[text - 1] }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let teks = `乂  *A P K*\n\n`
      teks += '	◦  *Name* : ' + json.data.name + '\n'
      teks += '	◦  *Version* : ' + json.data.version + '\n'
      teks += '	◦  *Size* : ' + json.data.size + '\n'
      teks += '	◦  *Category* : ' + json.data.category + '\n'
      teks += '	◦  *Installed* : ' + json.data.download + '\n'
      teks += '	◦  *Update* : ' + json.data.update + '\n'
      teks += '	◦  *Rating* : ' + json.data.rating + '\n\n'
      teks += global.set.footer
      let chSize = Func.sizeLimit(json.data.size, global.max_upload)
      if (chSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
      conn.sendMessageModify(m.chat, teks, m, {
        largeThumb: true,
        thumbnail: json.data.thumbnail
      }).then(async () => {
        conn.sendMedia(m.chat, json.data.url, m, {
          fileName: json.data.name + '.apk',
          mimetype: 'application',
          mentions: [m.sender]
        })
      })
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['apk']
handler.tags = ['downloader']
handler.command = ['apk', 'getapk']
handler.limit = 1
module.exports = handler