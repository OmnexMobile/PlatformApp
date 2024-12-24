module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
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
        'react-native-reanimated/plugin',
    ],
};
