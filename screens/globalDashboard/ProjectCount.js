import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconComponent, TextComponent } from 'components';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import strings from 'config/localization';
import useTheme from 'theme/useTheme';

const ProjectCount = ({ countDetails, projectCategory, title }) => {
    const { theme } = useTheme();
    const [currentTitle, setCurrentTitle] = useState(null);
    console.log('Category-->', countDetails, '--', projectCategory, '--', title, '--', currentTitle )

    useEffect(() => {
			if(title == 'PS') {
				setCurrentTitle(countDetails?.TotalConcern || 0);
			} else {
				setCurrentTitle(0);
			}
    }, [title, countDetails]);

    return (
        <View
            style={{
                flexDirection: 'row',
                // padding: SPACING.NORMAL,
                paddingVertical: SPACING.X_SMALL,
                borderBottomWidth: 2,
                borderColor: theme.mode.borderColor,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ justifyContent: 'flex-start', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {/* <IconComponent size={FONT_SIZE.LARGE} type={ICON_TYPE.AntDesign} style={{ paddingRight: SPACING.SMALL }} name="infocirlceo" /> */}
                <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                    {/* {strings.youhave}{' '} */}
                    <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD} color={theme.colors.primaryThemeColor}>
                        {/* {countDetails?.TotalConcern || 0} Concerns */}
                        {currentTitle} {projectCategory}
                    </TextComponent>
                </TextComponent>
            </TouchableOpacity>
        </View>
    );
};

export default ProjectCount;
