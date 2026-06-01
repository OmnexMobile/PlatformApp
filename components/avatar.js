import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT_SIZE } from 'constants/theme-constants';
import { ICON_TYPE } from 'constants/app-constant';
import IconComponent from './icon-component';
import TextComponent from './text';
import ImageComponent from './image-component';

class Avatar extends Component {
    static propTypes = {
        img: PropTypes.any,
        placeholder: PropTypes.string,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        roundedImage: PropTypes.bool,
        roundedPlaceholder: PropTypes.bool,
        small: PropTypes.bool,
        selected: PropTypes.bool,
    };

    static defaultProps = {
        roundedImage: true,
        roundedPlaceholder: true,
        small: false,
    };

    renderImage = () => {
        const { img, width, height, roundedImage, small, selected, noPlaceholder } = this.props;
        const { imageContainer, image } = styles;

        const viewStyle = [imageContainer];
        if (roundedImage) viewStyle.push({ borderRadius: Math.round(width + height) / 2 });
        return (
            <View style={[viewStyle, { backgroundColor: selected ? COLORS.green : COLORS.lightGrey }]}>
                {/* {selected ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <IconComponent name="check" type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </View>
                ) : (
                    <ImageComponent noPlaceholder={noPlaceholder} style={image} source={img} />
                )} */}
                <ImageComponent noPlaceholder={noPlaceholder} style={image} source={img} />
                {selected ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: COLORS.primaryLightTransparentThemeColor,
                        }}>
                        <IconComponent name="check" type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    </View>
                ) : null}
            </View>
        );
    };

    renderPlaceholder = () => {
        const { placeholder, width, height, roundedPlaceholder, small, selected, style } = this.props;
        const { placeholderContainer, placeholderText } = styles;

        const viewStyle = [placeholderContainer];
        if (roundedPlaceholder) viewStyle.push({ borderRadius: Math.round(width + height) / 2 });

        return (
            <View style={{}}>
                <View style={[viewStyle, { backgroundColor: selected ? COLORS.green : COLORS.lightGrey }, style]}>
                    {selected ? (
                        <IconComponent name="check" type={ICON_TYPE.AntDesign} color={COLORS.white} size={FONT_SIZE.LARGE} />
                    ) : (
                        <TextComponent
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            minimumFontScale={0.01}
                            style={[{ fontSize: small ? FONT_SIZE.XX_SMALL : FONT_SIZE.REGULAR }, placeholderText]}>
                            {placeholder}
                        </TextComponent>
                    )}
                </View>
            </View>
        );
    };

    render() {
        const { img, width, height } = this.props;
        const { container } = styles;
        return <View style={[container, this.props.style, { width, height }]}>{img ? this.renderImage() : this.renderPlaceholder()}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    imageContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        height: '100%',
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dddddd',
        height: '100%',
    },
    placeholderText: {
        fontWeight: '700',
        color: '#ffffff',
    },
});

export default Avatar;
