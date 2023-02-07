export default {
  title: "CableReady",
  description: "Use simple commands on the server to control client browsers in real-time.",
  ignoreDeadLinks: false,
  lastUpdated: true,
  themeConfig: {
    siteTitle: "CableReady",
    logo: "/cable-ready-logo.svg",
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stimulusreflex/cable_ready' },
      { icon: 'twitter', link: 'https://twitter.com/stimulusreflex' },
      { icon: 'discord', link: 'https://discord.gg/stimulus-reflex' }
    ],
    editLink: {
      pattern: 'https://github.com/stimulusreflex/cable_ready/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav: [
      { text: 'Changelog', link: 'https://github.com/stimulusreflex/cable_ready/releases' },
      { text: 'StimulusReflex', link: 'https://docs.stimulusreflex.com' },
      {
        text: 'v5.0.0',
        items: [
          {
            items: [
              { text: 'v4.5.0', link: 'https://v4-5-docs.cableready.stimulusreflex.com' },
              { text: 'v5.0.0', link: 'https://cableready.stimulusreflex.com' },
            ]
          }
        ]
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023'
    },
    sidebar: [
      {
        text: "Hello World",
        collapisble: true,
        items: [
          { text: "Welcome", link: "/hello-world/index" },
          { text: "Installation", link: "/hello-world/installation" },
          { text: "Hello World", link: "/hello-world/hello-world" },
          { text: "Setup", link: "/hello-world/setup" },
        ]
      },
      {
        text: "Guide",
        collapisble: true,
        items: [
          { text: "Channels 101", link: "/guide/cableready-101" },
          { text: "Working with CableReady", link: "/guide/working-with-cableready" },
          { text: "CableReady Everywhere", link: "/guide/cableready-everywhere" },
          { text: "Leveraging Stimulus", link: "/guide/leveraging-stimulus" },
          { text: "Stream Identifiers", link: "/guide/stream-identifiers" },
          { text: "Broadcasting to Resources", link: "/guide/broadcasting-to-resources" },
          { text: "stream_from", link: "/guide/stream-from" },
          { text: "Ride the Cable Car", link: "/guide/cable-car" },
          { text: "Customization", link: "/guide/customization" },
          { text: "ActionCable: It's Complicated", link: "/guide/action-cable" },
          { text: "Advocating for \"Reactive Rails\"", link: "/guide/advocating-for-reactive-rails" },
        ]
      },
      {
        text: "Reference",
        collapisble: true,
        items: [
          { text: "Methods", link: "/reference/methods" },
          { text: "Operations", link: "/reference/operations/index" },
          { text: "DOM Mutations", link: "/reference/operations/dom-mutations" },
          { text: "Element Property Mutations", link: "/reference/operations/element-mutations" },
          { text: "DOM Events", link: "/reference/operations/event-dispatch" },
          { text: "Browser Manipulations", link: "/reference/operations/browser-manipulations" },
          { text: "Notifications", link: "/reference/operations/notifications" },
        ]
      },
      {
        text: "Troubleshooting",
        collapisble: true,
        items: [
          { text: "Troubleshooting", link: "/troubleshooting/index" },
          { text: "Morph Sanity Checklist", link: "/troubleshooting/morph-checklist" },
        ]
      },
      {
        text: "Appendencies",
        collapisble: true,
        items: [
          { text: "Release History", link: "/appendencies/release-history" },
          { text: "implementation", link: "/appendencies/implementation" },
          { text: "Core Team", link: "/appendencies/team" },
        ]
      },
    ]
  }
}
