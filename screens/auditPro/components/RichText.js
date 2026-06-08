import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const RichText = ({ content }) => {
  const { width } = useWindowDimensions();

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
    <View style={{ width: '100%', paddingHorizontal: 5 }}>
      <RenderHtml
        contentWidth={width}
        source={{ html: cleaned }}
        tagsStyles={tagsStyles}
        defaultTextProps={{ selectable: false }}
        />
      </View>
  );
};

export default RichText;
