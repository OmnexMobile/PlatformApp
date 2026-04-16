module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['.'],
                // alias: {
                //     constants: './constants',
                //     components: './components',
                //     // assets: './assets',
                // },
            },
        ],
        'react-native-worklets/plugin',
    ],
    env: {
        production: {
          plugins: ['react-native-paper/babel'],
        },
      },
};
