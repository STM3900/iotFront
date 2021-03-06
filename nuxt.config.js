export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "iotFront",
    htmlAttrs: {
      lang: "fr",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Asap&family=Open+Sans&display=swap",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@assets/css/style.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    [
      "nuxt-fontawesome",
      {
        component: "fa",
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: [
              "faCode",
              "faTemperatureHalf",
              "faDroplet",
              "faWind",
              "faSun",
              "faBatteryThreeQuarters",
              "faTriangleExclamation",
              "faXmark",
            ],
          },
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: [],
          },
          { set: "@fortawesome/free-regular-svg-icons", icons: [] },
        ],
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "http://localhost:8080",
    proxyHeaders: false,
    credentials: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
