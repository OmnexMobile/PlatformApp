import React from 'react';
import TouchableScale from 'react-native-touchable-scale';

const BounceableView = ({ onPress, children, style = {}, activeScale = 0.9 }) => (
    <TouchableScale {...{ onPress, style }} activeScale={activeScale} tension={10} friction={7} useNativeDriver activeOpacity={1}>
        {children}
    </TouchableScale>
);

export default BounceableView;
