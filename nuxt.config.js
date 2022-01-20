/* eslint-disable nuxt/no-cjs-in-config */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { palette } = require('./config')

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Women Fashion Drop Shopping.',
    titleTemplate: `Fashion Express - %s`,
    htmlAttrs: {
      lang: 'en',
    },
    // TODO(rushui 2021-11-22): SSR optimize
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/style/tailwindcss.css',
    '~/assets/style/global.scss',
    '~/assets/style/main.scss',
    'ant-design-vue/dist/antd.less',
  ],

  tailwindcss: {
    viewer: false,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/antd-ui.js'],

  serverMiddleware: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  router: {},

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {
          config: './tailwind.config.js',
        },
        'postcss-import': {},
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true,
        },
      },
    },
    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': palette.primary,
          'info-color': palette.primary,
          'processing-color': palette.primary,
          'link-color': palette.link,
        },
      },
    },
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'lib',
            style: true,
          },
        ],
      ],
    },
  },
}
