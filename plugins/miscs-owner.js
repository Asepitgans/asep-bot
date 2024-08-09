module.exports = {
   run: async (m, {
      conn,
      env
   }) => {
      conn.sendContact(m.chat, [{
         name: env.owner_name,
         number: env.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'Asep Support',
         website: 'https://unitedcyberteam.com',
         email: 'contact@unitedcyberteam.com'
      })
   },
   help: ['owner'],
   tags: ['miscs'],
   command: /^(owner|creator)$/i
}
