import React, { useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from 'constants/theme-constants';

const ImageComponent = ({ resizeMode = 'cover', source, style = { width: '100%', height: '100%' }, withLoader = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const onLoadEnd = () => {
        setIsLoaded(true);
    };

    return (
        <View style={[style]}>
            <FastImage
                {...{
                    onLoadEnd,
                    resizeMode,
                    source: source?.uri ? { uri: source?.uri } : source,
                }}
                style={[
                    {
                        width: undefined,
                        height: undefined,
                        flex: 1,
                        borderRadius: style?.borderRadius || 0,
                    },
                ]}
            />
            {!isLoaded && withLoader && (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 100,
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <SkeletonPlaceholder>
                            <View
                                style={{ width: '100%', height: '100%', backgroundColor: COLORS.lightGrey, borderRadius: style?.borderRadius || 0 }}
                            />
                        </SkeletonPlaceholder>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ImageComponent;
