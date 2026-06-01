module.exports = {
    presets: ['module:@react-native/babel-preset'],
    // plugins: [
    //     [
    //         'module-resolver',
    //         {
    //             root: ['.'],
    //             // alias: {
    //             //     constants: './constants',
    //             //     components: './components',
    //             //     // assets: './assets',
    //             // },
    //         },
    //     ],
    //     'react-native-reanimated/plugin', // must be last
    // ],
     plugins: [
        [
            'module-resolver',
            {
                root: ['.'],
                alias: {
                    assets: './assets',
                    components: './components',
                    config: './config',
                    constants: './constants',
                    contexts: './contexts',
                    global: './global',
                    helpers: './helpers',
                    hooks: './hooks',
                    navigations: './navigations',
                    screens: './screens',
                    services: './services',
                    store: './store',
                    theme: './theme',
                    vendor: './vendor',
                },
            },
        ],
        'react-native-reanimated/plugin', // must be last
    ],
    env: {
        production: {
            plugins: ['react-native-paper/babel'],
        },
    },
};