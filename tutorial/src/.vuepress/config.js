module.exports = {
  title: 'dcl-escape-room-tutorial',
  description: 'Decentraland tutorial',
  base: '/dcl-escape-room-tutorial/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/introduction' },
      { text: 'External', link: 'https://google.com' },
    ],

    sidebar: [
      '/',
      '/00-setup',
      '/01-door',
      '/02-button',
    ]
  },
}
