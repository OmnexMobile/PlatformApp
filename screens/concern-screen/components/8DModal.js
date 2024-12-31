import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import { IconComponent, LottieAnimation, ModalComponent } from 'components';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import { ICON_TYPE } from 'constants/app-constant';
import { LOTTIE_FILE } from 'assets/lottie';
import useTheme from 'theme/useTheme';

const EightDModal = ({ modalVisible, onRequestClose, url='https://cloudqa3.ewqims.com//Common/ProblemSolver/PSShowForm/Index?ConcernID=16&modeid=2&ApproachID=1&Documenttype=13&ConcernAnalysis=1&PrimaryLangID=1&SecondaryLangID=1' }) => {
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    return (
        <ModalComponent {...{ modalVisible, onRequestClose }}>
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View style={{ height: SPACING.XX_LARGE, alignItems: 'flex-end', justifyContent: 'center', paddingRight: SPACING.SMALL }}>
                    <TouchableOpacity onPress={onRequestClose}>
                        <IconComponent size={FONT_SIZE.LARGE} type={ICON_TYPE.AntDesign} name="close" />
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <View
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                            position: 'absolute',
                            top: SPACING.XX_LARGE,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            zIndex: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <View
                            style={{
                                height: RFPercentage(25),
                                width: RFPercentage(25),
                            }}>
                            <LottieAnimation file={LOTTIE_FILE.Loader} />
                        </View>
                    </View>
                ) : null}
                <WebView
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    source={{
                        uri: url,
                    }}
                />
            </View>
        </ModalComponent>
    );
};

export default EightDModal;
