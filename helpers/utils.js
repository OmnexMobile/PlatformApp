import { isIphoneX } from 'react-native-iphone-x-helper';
import { Platform, StatusBar, Dimensions, Alert, Linking } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import JailMonkey from 'jail-monkey';
import { COLORS, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { LOCAL_STORAGE_VARIABLES, TOAST_STATUS } from 'constants/app-constant';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const getAvatarInitials = textString => {
    if (!textString) return '';
    const text = textString.trim();
    const textSplit = text.split(' ');
    if (textSplit.length <= 1) return text.charAt(0);
    const initials = textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    return initials;
};

//
// ─── JAIL MONKEY VARIABLES ──────────────────────────────────────────────────────
//
export const isJailBroken = JailMonkey.isJailBroken();
export const canMockLocation = JailMonkey.canMockLocation();
export const trustFall = JailMonkey.trustFall();

//
// ─── ACTION CREATORS ────────────────────────────────────────────────────────────
//
export const createAction = module => ({
    REQUEST: `${module}_REQUEST`,
    LOADING: `${module}_LOADING`,
    SUCCESS: `${module}_SUCCESS`,
    ERROR: `${module}_ERROR`,
    RESET: `${module}_RESET`,
    SET_DATA: `${module}_SET_DATA`,
});

// export const objToQs = params =>
//     Object.keys(params)
//         .map(key => key + '=' + params[key])
//         .join('&');

export const objToQs = params =>
    Object.keys(params)
        .filter(key => params[key] !== '' && params[key] !== undefined)
        .map(key => key + '=' + params[key])
        .join('&');

export const successMessage = ({ message = 'Success', description = 'Successfully Saved', type = 'success' }) =>
    showMessage({
        message,
        description,
        type,
        backgroundColor: COLORS.success,
        color: COLORS.white,
        duration: 1500,
        position: 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });

export const showErrorMessage = message =>
    showMessage({
        message: 'Error',
        description: message?.toString(),
        type: 'danger',
        backgroundColor: FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration: 1500,
        position: 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });

export const toast = (title = 'Success', desc = 'Successfully Saved', type = TOAST_STATUS.SUCCESS, duration = 1500) => {
    const message = title ? title : type === TOAST_STATUS.SUCCESS ? 'Success' : 'Error';
    return showMessage({
        type,
        message,
        description: desc,
        backgroundColor: type === TOAST_STATUS.SUCCESS ? COLORS.success : FlashMessage.ColorTheme.danger,
        color: COLORS.white,
        duration,
        position: 'bottom',
        style: {
            borderRadius: SPACING.NORMAL,
            margin: SPACING.SMALL,
        },
    });
};

// Responsive font size
export function RFPercentage(percent) {
    const { height, width } = Dimensions.get('window');
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait
    const deviceHeight = isIphoneX() || Platform.OS === 'android' ? standardLength - offset : standardLength;
    const heightPercent = (percent * deviceHeight) / 100;
    return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680
export function RFValue(fontSize, standardScreenHeight = 680) {
    const { height, width } = Dimensions.get('window');
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight = isIphoneX() || Platform.OS === 'android' ? standardLength - offset : standardLength;

    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
}

export const getElevation = () => {
    const { theme } = useTheme();
    return {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: theme.mode.backgroundColor,
    };
};

export const formReq = request => {
    var formData = new FormData();
    const transformedData = Object.entries(request).map(([key, value]) => ({ key, value }));
    transformedData.map(({ key, value }) => formData.append(key, value));
    return formData;
};

export function convertStringToHTML(htmlString) {
    // Create a map of HTML entities and their corresponding characters
    const entitiesMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&apos;': "'",
        '&cent;': '¢',
        '&pound;': '£',
        '&yen;': '¥',
        '&euro;': '€',
        '&copy;': '©',
        '&reg;': '®',
        '&nbsp;': ' ',
        '&iexcl;': '¡',
        '&laquo;': '«',
        '&raquo;': '»',
        '&middot;': '·',
        '&para;': '¶',
        '&sect;': '§',
        '&trade;': '™',
    };

    // Use a regular expression to replace all entities in the map
    const decodedString = htmlString.replace(/&[a-zA-Z]+;/g, match => entitiesMap[match] || match);

    return decodedString;
}

export const isHTML = str => {
    // Regular expression to match HTML tags
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
};

export const openLink = async (link = '', color = '#fff') => {
    try {
        const url = link;
        if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                preferredBarTintColor: color,
                preferredControlTintColor: 'white',
                readerMode: false,
                animated: true,
                modalPresentationStyle: 'fullScreen',
                modalTransitionStyle: 'coverVertical',
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: color,
                secondaryToolbarColor: 'black',
                navigationBarColor: 'black',
                navigationBarDividerColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                    startEnter: 'slide_in_right',
                    startExit: 'slide_out_left',
                    endEnter: 'slide_in_left',
                    endExit: 'slide_out_right',
                },
                headers: {
                    'my-custom-header': 'my custom header value',
                },
            });
            // await this.sleep(800);
            // Alert.alert(JSON.stringify(result));
        } else Linking.openURL(url);
    } catch (error) {
        // Alert.alert(error.message);
    }
};
