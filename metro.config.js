/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// Remove 'svg' from assetExts and add it to sourceExts for react-native-svg-transformer
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  ext => ext !== 'svg'
);
defaultConfig.resolver.sourceExts.push('svg');

// Add the SVG transformer
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: defaultConfig.resolver,
};

module.exports = mergeConfig(defaultConfig, config);
