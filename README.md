To Rename the App:
npx react-native-rename "App Name" -b com.organizationname.appname

Generate App Icons for Android and IOS
https://icon.kitchen/

keystore
omnex123
omnex123
Omnex
CN=Omnex, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=IN
Check patchfile for setup :-- "deprecated-react-native-prop-types",
Example:
nodemodules---> (node_modules/react-native-scrollable-tab-view/DefaultTabBar.js) ---> 
import { ViewPropTypes, TextPropTypes } from 'deprecated-react-native-prop-types';
    textStyle: TextPropTypes.style, is correct.

use this before create debug build
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

To create aab build 
cd android && ./gradlew clean && ./gradlew bundleRelease

To create debug build
cd android && ./gradlew clean && ./gradlew assembleDebug

To create Apk
cd android && ./gradlew clean && ./gradlew assembleRelease


npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/

rm -rf android/app/src/main/res/drawable-* 
rm -rf android/app/src/main/res/raw/*


npx react-native generate-bootsplash assets/bootsplash_logo.png \
  --background=#ffffff \
  --logo-width=100 \
  --assets-output=assets \
  --flavor=main