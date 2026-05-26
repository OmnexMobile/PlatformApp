const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: {assetExts, sourceExts},
} = defaultConfig;
const reactRoot = path.dirname(require.resolve('react/package.json'));

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
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react') {
        return context.resolveRequest(context, require.resolve('react'), platform);
      }

      if (moduleName.startsWith('react/')) {
        return context.resolveRequest(
          context,
          path.join(reactRoot, moduleName.slice('react/'.length)),
          platform,
        );
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
});
