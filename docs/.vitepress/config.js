export default {
  title: 'CableReady',
  description:
    'Use simple commands on the server to control client browsers in real-time.',
  ignoreDeadLinks: false,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'CableReady',
    logo: {
      light: '/cable-ready-logo.svg',
      dark: '/cable-ready-logo-dark.svg'
    },
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stimulusreflex/cable_ready' },
      { icon: 'twitter', link: 'https://twitter.com/stimulusreflex' },
      { icon: 'discord', link: 'https://discord.gg/stimulus-reflex' }
    ],
    editLink: {
      pattern:
        'https://github.com/stimulusreflex/cable_ready/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav: [
      {
        text: 'Changelog',
        link: 'https://github.com/stimulusreflex/cable_ready/releases'
      },
      { text: 'StimulusReflex', link: 'https://docs.stimulusreflex.com' },
      {
        text: 'v5.0.0'
        // items: [
        //   {
        //     items: [
        //       { text: 'v4.5.0', link: 'https://v4-5-docs.cableready.stimulusreflex.com' },
        //       { text: 'v5.0.0', link: 'https://cableready.stimulusreflex.com' },
        //     ]
        //   }
        // ]
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023'
    },
    sidebar: [
      {
        text: 'Hello World',
        collapsed: false,
        collapisble: true,
        items: [
          { text: 'Welcome', link: '/hello-world/index' },
          { text: 'Installation', link: '/hello-world/installation' },
          { text: 'Hello World', link: '/hello-world/hello-world' },
          { text: 'Setup', link: '/hello-world/setup' }
        ]
      },
      {
        text: 'Reference',
        collapsed: false,
        collapisble: true,
        items: [
          { text: 'Operations', link: '/reference/operations/index' },
          { text: 'Methods', link: '/reference/methods' },
        ]
      },
      {
        text: 'Guide',
        collapsed: false,
        collapisble: true,
        items: [
          { text: 'Channels 101', link: '/guide/cableready-101' },
          {
            text: 'Working with CableReady',
            link: '/guide/working-with-cableready'
          },
          {
            text: 'CableReady Everywhere',
            link: '/guide/cableready-everywhere'
          },
          { text: 'Leveraging Stimulus', link: '/guide/leveraging-stimulus' },
          { text: 'Stream Identifiers', link: '/guide/stream-identifiers' },
          {
            text: 'Broadcasting to Resources',
            link: '/guide/broadcasting-to-resources'
          },
          { text: 'cable_ready_stream_from', link: '/guide/cable-ready-stream-from' },
          { text: 'Ride the Cable Car', link: '/guide/cable-car' },
          { text: 'Customization', link: '/guide/customization' },
          {
            text: "ActionCable: It's Complicated",
            link: '/guide/action-cable'
          },
          {
            text: 'Advocating for "Reactive Rails"',
            link: '/guide/advocating-for-reactive-rails'
          },
          {
            text: 'Updatable - Batteries Included Reactivity',
            link: '/guide/updatable'
          }
        ]
      },
      {
        text: 'Troubleshooting',
        collapsed: true,
        collapisble: true,
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting/index' },
          {
            text: 'Morph Sanity Checklist',
            link: '/troubleshooting/morph-checklist'
          }
        ]
      },
      {
        text: 'Appendencies',
        collapsed: true,
        collapisble: true,
        items: [
          { text: 'Release History', link: '/appendencies/release-history' },
          { text: 'Implementation', link: '/appendencies/implementation' },
          { text: 'Core Team', link: '/appendencies/team' }
        ]
      }
    ]
  }
}
