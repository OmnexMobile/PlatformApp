import { useState, useEffect } from 'react';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

export const useInternetReachable = () => {
    const [isReachable, setIsReachable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
        // 	if (typeof isConnected !== 'boolean') return;
        // 	setIsLoading(false);
        // 	setIsReachable(isConnected);
        // });
        // return () => {
        // 	unsubscribe();
        // };
    }, []);
    const { isInternetReachable } = useNetInfo();

    // return { isInternetReachable: isReachable, isLoading };
    return { isInternetReachable, isLoading };
};
