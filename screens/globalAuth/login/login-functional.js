import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import API_URL from 'global/ApiUrl';
import { LOCAL_STORAGE_VARIABLES, ROUTES } from 'constants/app-constant';
import localStorage from 'global/localStorage';
import { formReq, showErrorMessage } from 'helpers/utils';
import strings from 'config/localization';
import { useAppContext } from 'contexts/app-context';
import LoginPresentational from './login-presentational';
import { postAPI } from 'global/api-helpers';
import auth from '../../../services/Auditpro-Auth';
import AsyncStorage from '@react-native-community/async-storage';

const LoginFunctional = ({}) => {
	const [selectLanguageModal, setSelectLanguageModal] = useState(false);
	const [loginDetails, setLoginDetails] = useState({
			// username: 'Champion1@michelin',
			// password: 'a1',
			username: '',
			password: '',
			loggingIn: false,
	});
	const [currentToken, setCurrentToken] = useState('');
	// const [currentURL, setCurrentURL] = useState('');
	const { profile, handleLogin, sites, handleSiteList, appSettings, globalURL, globalLoginData, handleGlobalLogin, handleGlobalURL, globalDeviceDetails } = useAppContext();
	const navigation = useNavigation();
	// const isRegistered = !!appSettings?.serverUrl;
	const isRegistered = !!globalURL?.serverUrl;
	// console.log('currentURL--->login1', currentURL)
	// const isRegistered = currentURL;

	useEffect(() => {
		console.log('currentToken--->', currentToken)
		currentToken && navigation.navigate(ROUTES.SPLASH_SCREEN);
	}, [currentToken]);

	// useEffect(() => {
	// 	async function fetchData() {
	// 		const currentUrl = await localStorage.getData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL);
	// 		console.log('currentURL--->login', currentUrl)
	// 		setCurrentURL(currentUrl)
	// 	}
	// 	fetchData();

	// }, [currentURL])

	useEffect(() => {
		!isRegistered && navigation.navigate(ROUTES.GLOBAL_REGISTER);
	}, []);

	const handleInputChange = (label, value) => {
		setLoginDetails({
			...loginDetails,
			[label]: value,
		});
	};

	console.log('!!globalURL?.serverUrl--->', !!globalURL?.serverUrl, '--', globalURL?.serverUrl, '--globalLoginData', globalLoginData)
	console.log('sites---->get', sites)

	const handleSubmit = async () => {
		const loginflag = 1;
		if (isRegistered) {
			console.log('loginDetails', loginDetails, 'loginURL--->', globalURL?.serverUrl + `${API_URL.GLOBAL_LOGIN}`);
			handleInputChange('loggingIn', true);
			var key = CryptoJS.enc.Utf8.parse('8080808080808080');
			var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
			var encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(loginDetails?.password), key, {
				keySize: 128 / 8,
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
			});
			console.log('get response from Login', loginDetails?.username, loginDetails?.password, encryptedPassword);
			handleLoginCall(encryptedPassword, loginflag)
		} else {
			navigation.navigate(ROUTES.GLOBAL_REGISTER);
		}
	};

	const handleServerURL = (currentData) => {
		console.log('loginDetails?.username---->', loginDetails?.username, currentData?.Data[0], typeof currentData?.Data[0].FullName)
		var currentUser = ''
		if(currentData?.Data[0].FullName == "Chandran Bragi  "){
			currentUser = 'Chandran Bragi'
		}
		console.log('username--->', currentUser)
		const userDetails = {
			userId: currentData?.Data[0]?.UserId.toString(),
			siteId: currentData?.Data[0]?.Siteid,
			accessToken: currentData?.Token,
			userFullName: currentUser,
			smAccess: currentData?.Data[0]?.SupplierManagementAccess,
			message: currentData?.Message,
			success: currentData?.Success,
			data: currentData?.Data,

		  };
		  const stringifiedUserDetails = JSON.stringify(userDetails);
		  AsyncStorage.setItem('userDetails', stringifiedUserDetails);
		  console.log('Set Async userDetails ', stringifiedUserDetails)

		
		// 	localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, globalDeviceDetails?.deviceDetails?.PSApiURL);
		// 	handleGlobalURL('serverUrl', globalDeviceDetails?.deviceDetails?.PSApiURL)
		localStorage.storeData('appLogged', true);
	}

	const handleLoginCall = async (encryptedPassword, loginflag, isSso) => { 
		const fcmToken = '';
		const deviceId = await AsyncStorage.getItem('deviceid')
		console.log('get deviceId', deviceId)
		try {
			auth.globalLogin(
				loginDetails?.username,
				encryptedPassword.toString(),
				fcmToken,
				deviceId,
				loginflag,
				isSso,
				(res, data) => {
					console.log('global loginUser---->', data, res);
					if (data?.data?.Success == true) {
						console.log('checking global loginResponse---->', data?.data);
						data?.data?.Token && setProfileCall(data?.data); // navigate to home
						handleGlobalLogin(data?.data);
						handleServerURL(data?.data);
					} else {
						handleInputChange('loggingIn', false);
						showErrorMessage('User data not found!' || data?.Message || strings?.InvalidCred);
					}
					handleInputChange('loggingIn', false);
				}
			)
		} catch (err) {
			console.log('🚀 ~ file: login-functional.js:58 ~ handleSubmit ~ err', err);
			handleInputChange('loggingIn', false);
			showErrorMessage('Something went wrong!!');
		}
	}

	const setProfileCall = data => {
		console.log('🚀 ~ file: login-functional.js:69 ~ setProfileCall ~ data', data);
		localStorage.storeData(LOCAL_STORAGE_VARIABLES.Token, data?.Token);
		localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserId, data?.Data[0]?.UserId);
		localStorage.storeData(LOCAL_STORAGE_VARIABLES.UserFullName, data?.Data[0]?.FullName);
		localStorage.storeData('CurrentApp', 'problemSolver');
		handleLogin({
			Token: data?.Token,
			UserId: data?.Data?.[0]?.UserId?.toString(),
			SiteId: data?.Data?.[0]?.SiteId?.toString(),
			UserFullName: data?.Data?.[0]?.FullName,
			CurrentApp: 'problemSolver',
		});
		handleSiteList(data?.Data);
		setCurrentToken(data?.Token);
	};

	return (
		<LoginPresentational
			{...{ selectLanguageModal, setSelectLanguageModal, handleInputChange, handleSubmit, loginDetails, navigation, isRegistered }}
		/>
	);
};

export default LoginFunctional;