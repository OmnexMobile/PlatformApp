import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { AutoSkeletonView } from 'react-native-auto-skeleton';
import { COLORS } from 'constants/theme-constants';

const ImageComponent = ({ 
    resizeMode = 'cover', 
    source, 
    style = { width: '100%', height: '100%' }, 
    withLoader = false 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const onLoadEnd = () => {
        setIsLoaded(true);
    };

    return (
        <View style={[style]}>
            <Image
                onLoadEnd={onLoadEnd}
                resizeMode={resizeMode}
                source={source?.uri ? { uri: source?.uri } : source}
                style={{
                    width: undefined,
                    height: undefined,
                    flex: 1,
                    borderRadius: style?.borderRadius || 0,
                }}
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
                        <AutoSkeletonView>
                            <View
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    backgroundColor: COLORS.lightGrey, 
                                    borderRadius: style?.borderRadius || 0 
                                }}
                            />
                        </AutoSkeletonView>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ImageComponent;