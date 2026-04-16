const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: {assetExts, sourceExts},
} = defaultConfig;

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    ...defaultConfig.transformer,
    hermesParser: true,
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native',
    ),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
});
