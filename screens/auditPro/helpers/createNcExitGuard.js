import { BackHandler } from 'react-native';
import { ROUTES } from 'constants/app-constant';
import { captureCreateNcFormSnapshot, hasCreateNcUnsavedChanges } from './createNcFormSnapshot';

export const captureFormBaseline = component => {
    component.formBaseline = captureCreateNcFormSnapshot(component.state);
};

export const hasUnsavedFormChanges = component => hasCreateNcUnsavedChanges(component.state, component.formBaseline);

const promptExit = (component, navigateHome) => {
    component.setState({ exitDialogVisible: true, go_home: navigateHome });
};

const performExit = (component, navigateHome) => {
    component.allowNavigation = true;
    component.safeRemoveVoiceListeners?.();
    component.InitVoice?.();

    if (navigateHome) {
        component.props.navigation.navigate(ROUTES.GLOBAL_DASHBOARD);
        return;
    }

    component.props.navigation.goBack();
};

export const requestGoBack = component => {
    if (component.state.exitDialogVisible) {
        component.setState({ exitDialogVisible: false, go_home: false });
        return;
    }

    if (hasUnsavedFormChanges(component)) {
        promptExit(component, false);
        return;
    }

    performExit(component, false);
};

export const requestGoHome = component => {
    if (hasUnsavedFormChanges(component)) {
        promptExit(component, true);
        return;
    }

    performExit(component, true);
};

export const discardAndExit = component => {
    const navigateHome = component.state.go_home;
    component.setState({ exitDialogVisible: false, go_home: false }, () => {
        performExit(component, navigateHome);
    });
};

export const saveAndExit = component => {
    component.setState({ exitDialogVisible: false }, () => {
        component.onSave();
    });
};

export const handleHardwareBackPress = component => {
    requestGoBack(component);
    return true;
};

export const setupExitGuard = component => {
    component.formBaseline = null;
    component.allowNavigation = false;

    component.beforeRemoveUnsubscribe = component.props.navigation.addListener('beforeRemove', event => {
        if (component.allowNavigation || !hasUnsavedFormChanges(component)) {
            return;
        }

        event.preventDefault();
        promptExit(component, false);
    });

    component.backHandler = BackHandler.addEventListener('hardwareBackPress', () => handleHardwareBackPress(component));
};

export const teardownExitGuard = component => {
    component.beforeRemoveUnsubscribe?.();
    component.backHandler?.remove();
};
