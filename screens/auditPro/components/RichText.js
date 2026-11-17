import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import TableRenderer, { tableModel } from '@native-html/table-plugin';
import WebView from 'react-native-webview';

const renderers = { table: TableRenderer };
const customHTMLElementModels = { table: tableModel };
const renderersProps = {
  table: {
    displayMode: 'expand',
    animationType: 'none',
    cssRules: `
      html, body { margin: 0; padding: 0; background: transparent; }
      body { font-family: sans-serif; font-size: 18px; line-height: 26px; color: #1A1A1A; }
      table { border-collapse: collapse; min-width: 100%; }
      th, td { border: 1px solid #b5b5b5; padding: 6px; vertical-align: top; }
      th { font-weight: bold; }
      p { margin: 0 0 8px; }
      img { max-width: 100%; height: auto; }
    `,
  },
};

const RichText = ({ content }) => {
  const { width } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(null);

  const cleaned = useMemo(() => {
    const html = content || '';
    return html
      .replace(/<p>(\s|&nbsp;)*<\/p>/gi, '')
      .replace(/(<br\s*\/?>)+$/gi, '')
      .replace(/\s+$/, '');
  }, [content]);

  const tagsStyles = useMemo(
    () => ({
      body: { fontSize: 18, color: '#1A1A1A', lineHeight: 26 },
      p: { marginTop: 0, marginBottom: 8, color: '#1A1A1A' },
      ul: { marginTop: 4, marginBottom: 8, paddingLeft: 18 },
      li: { marginBottom: 6 },
      strong: { fontWeight: '700' },
      u: { textDecorationLine: 'underline' },
    }),
    []
  );

  return (
    <View
      style={{ width: '100%', flexShrink: 1, paddingHorizontal: 5 }}
      onLayout={({ nativeEvent }) => {
        const availableWidth = nativeEvent.layout.width - 10;
        if (availableWidth > 0) {
          setContainerWidth(availableWidth);
        }
      }}>
      <RenderHtml
        contentWidth={containerWidth ?? Math.max(1, width - 10)}
        source={{ html: cleaned }}
        WebView={WebView}
        renderers={renderers}
        customHTMLElementModels={customHTMLElementModels}
        renderersProps={renderersProps}
        tagsStyles={tagsStyles}
        defaultTextProps={{ selectable: false }}
        />
      </View>
  );
};

export default RichText;
