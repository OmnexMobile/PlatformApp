import { API_STATUS } from 'constants/app-constant';
import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'screens/profile/profile.action';
import EditProfilePresentational from './edit-profile-presentational';

const EditProfileFunctional = ({ userDetails }) => {
    const { profileData, updateProfileAPIStatus } = useSelector(({ common, profile: { profileData, updateProfileAPIStatus } }) => ({
        common,
        profileData,
        updateProfileAPIStatus,
    }));
    const [profileDetails, setProfileDetails] = useState(profileData);
    const [backupObj, setBackupObj] = useState(profileData);
    const [buttonLoading, setButtonLoading] = useState(false);
    const dispatch = useDispatch();

    const formatObj = object => {
        return {
            firstName: object?.firstName || '',
            lastName: object?.lastName || '',
            email: object?.email || '',
            mobile: object?.mobile || '',
            updatedAt: object?.updatedAt || '',
        };
    };
    useEffect(() => {
        const object = formatObj(profileData);
        setProfileDetails(object);
        setBackupObj(object);
    }, [profileData]);

    const inputs = useMemo(
        () => [
            {
                label: 'First Name',
                name: 'firstName',
                editable: true,
            },
            {
                label: 'Last Name',
                name: 'lastName',
                editable: true,
            },
            {
                label: 'Mobile Number',
                name: 'mobile',
                editable: false,
                helpText: 'To change the number please contact admin',
            },
            {
                label: 'Email',
                name: 'email',
                editable: true,
            },
        ],
        [],
    );

    const handleUpdate = () => {
        const request = {
            firstName: profileDetails?.firstName || '',
            lastName: profileDetails?.lastName || '',
            email: profileDetails?.email || '',
            // mobile: profileDetails?.mobile || '',
        };
        dispatch(updateProfile(request));
        // const request = {
        // 	saloonName: saloonDetails?.saloonName,
        // 	saloonDescription: saloonDetails?.saloonDescription,
        // 	contactNumber: saloonDetails?.contactNumber,
        // 	saloonEmail: saloonDetails?.saloonEmail,
        // 	saloonWebsite: saloonDetails?.saloonWebsite,
        // 	location: {
        // 		address: saloonDetails?.address,
        // 		blockNumber: saloonDetails?.blockNumber,
        // 		city: saloonDetails?.city,
        // 		state: saloonDetails?.state,
        // 		pinCode: saloonDetails?.pinCode,
        // 	},
        // };
        // setButtonLoading(true);
        // CommonServices.updateSaloonDetailsService(request, '')
        // 	.then((res) => {
        // 		showMessage({
        // 			message: 'Success',
        // 			description: 'Your profile was successfully updated!',
        // 			type: 'success',
        // 			backgroundColor: Colors.success,
        // 			color: Colors.white,
        // 			duration: 3000,
        // 		});
        // 		getSaloonDetails();
        // 		setButtonLoading(false);
        // 	})
        // 	.catch((err) => {
        // 		setButtonLoading(false);
        // 	});
    };

    const handleChange = (name, value) => {
        setProfileDetails({
            ...profileDetails,
            [name]: value,
        });
    };

    const isSame = useMemo(() => JSON.stringify(profileDetails) === JSON.stringify(backupObj), [profileDetails]);

    const loading = updateProfileAPIStatus === API_STATUS.PENDING;

    return (
        <EditProfilePresentational
            {...{ userDetails, handleUpdate, buttonLoading, inputs, profileDetails, handleChange, loading, buttonLoading, isSame }}
        />
    );
};

export default EditProfileFunctional;
