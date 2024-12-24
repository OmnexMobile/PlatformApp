// export var API_URL = 'http://1.22.172.236/APQPApi/'; // Static IP
// export var API_URL = 'http://1.22.172.236/APQPApi/'; //Edited_by_Sudha
export var API_URL = 'http://1.22.172.236/ProblemSolverAPI/'; //Edited_by_Sudha
export var DP_API_URL = 'http://1.22.172.236/DPAPI/api/'; // Static IP - DocPro

export default {
    setServerUrl(serverUrl) {
        console.log('set serverUrl', serverUrl);
        API_URL = serverUrl;
        var defaultDomain = DP_API_URL.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        var actualDomain = serverUrl.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        DP_API_URL = DP_API_URL.replace(defaultDomain, actualDomain);
        console.log('set serverUrl', DP_API_URL);
    },
    getListdata(UserID, SiteId, StatusID, token, cb) {
        var formData = new FormData();
        formData.append('UserID', UserID);
        formData.append('SiteId', SiteId);
        formData.append('Filterstring', StatusID);
        fetch(API_URL + 'DashBoard/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
    geteditdetails(ConcernID, cb) {
        var formData = new FormData();
        formData.append('ConcernID', ConcernID);
        console.log('geteditdetails api formData', formData);

        fetch(API_URL + 'Concern/GetConcern', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
    getcategory(SiteID, cb) {
        var formData = new FormData();
        formData.append('SiteID', SiteID);
        console.log('getcategory api formData', formData);

        fetch(API_URL + 'Category/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
    getsubcategory(CategoryID, SiteID, cb) {
        var formData = new FormData();
        formData.append('CategoryID', CategoryID);
        formData.append('SiteID', SiteID);
        console.log('getsubcategory api formData', formData);

        fetch(API_URL + 'SubCategory/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
    getcount(userid, siteId, cb) {
        var formData = new FormData();
        formData.append('userid', userid);
        formData.append('siteId', siteId);
        console.log('count api formData', formData);

        fetch(API_URL + 'DashBoard/GetConcernStatusCount', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqp(UserID, SiteId, Index, maxRow, ListType, projectView, FilterValue, FilterColumn, OrderBy, Sorttype, StartDate, EndDate, Token, cb) {
        var formData = new FormData();
        formData.append('SiteId', SiteId);
        formData.append('UserId', UserID);
        formData.append('Index', Index);
        formData.append('maxRow', maxRow);
        formData.append('ListType', ListType);
        formData.append('projectView', projectView);
        formData.append('FilterValue', FilterValue);
        formData.append('FilterColumn', FilterColumn);
        formData.append('OrderBy', OrderBy);
        formData.append('Sorttype', Sorttype);
        formData.append('StartDate', StartDate);
        formData.append('EndDate', EndDate);

        console.log('apqp managerformData', formData);
        console.log('apqp API_URL', API_URL + 'APQPLanding/List');

        console.log('apqp Authorization--->' + Token);

        fetch(API_URL + 'APQPLanding/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    filterapqp(UserID, SiteId, Index, maxRow, ListType, projectView, startDate, endDate, Token, cb) {
        var formData = new FormData();
        formData.append('SiteID', SiteId);
        formData.append('UserId', UserID);
        formData.append('Index', Index);
        formData.append('MaxRow', maxRow);
        formData.append('ListType', ListType);
        formData.append('ProjectView', projectView);
        formData.append('StartDate', startDate);
        formData.append('EndDate', endDate);

        console.log('formData', formData);

        fetch(API_URL + 'APQPLanding/Filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqp2(UserID, ProjectId, TaskId, MaxRow, ListType, ProjectView, Token, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('ProjectId', ProjectId);
        formData.append('TaskId', TaskId);
        formData.append('MaxRow', MaxRow);
        formData.append('ListType', ListType);
        formData.append('ProjectView', ProjectView);

        console.log('formData', formData);
        console.log('Deliverables_API------>', API_URL + 'APQPLanding/MyGanttList');

        fetch(API_URL + 'APQPLanding/MyGanttList', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getLogin(UserName, Password, cb) {
        var formData = new FormData();
        formData.append('UserName', UserName);
        formData.append('Password', Password);
        console.log('formData', formData);
        fetch(API_URL + 'Login/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                //'Authorization': 'Bearer' + ' ' + token
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    // registerDevice(
    //   RegisteredDeviceId,
    //   ServerUrl,
    //   RegisteredDate,
    //   Active,
    //   IsDeleted,
    //   UnRegisteredDate,
    //   cb
    // ) {
    //   var today = new Date();
    //   var dd = today.getDate();
    //   var mm = today.getMonth() + 1; //January is 0!
    //   var yyyy = today.getFullYear();
    //   if (dd < 10) {
    //     dd = "0" + dd;
    //   }
    //   if (mm < 10) {
    //     mm = "0" + mm;
    //   }
    //   today = yyyy + "-" + mm + "-" + dd;

    //   var formData = new FormData();
    //   formData.append("RegisteredDeviceId", RegisteredDeviceId);
    //   formData.append("ServerUrl", ServerUrl);
    //   formData.append("RegisteredDate", today);
    //   formData.append("Active", Active);
    //   formData.append("IsDeleted", IsDeleted);
    //   formData.append("UnRegisteredDate", today);

    //   console.log("formData", formData);

    //   fetch(API_URL + "RegisterDevice/RegisterDevice", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       //'Authorization': 'Bearer' + ' ' + token
    //     },
    //     body: formData,
    //   })
    //     .then((resp) => resp.json())
    //     .then((data) => {
    //       console.log("--->", data);
    //       cb({
    //         data,
    //       });
    //     })
    //     .catch((data) => {
    //       cb({
    //         //status: cons.ERROR_500
    //         status: data,
    //       });
    //     });
    // },

    registerDevice(deviceId, url, type, cb) {
        console.log('register device ', type);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;

        //today = "2020-12-5";

        var formData = new FormData();
        formData.append('RegisteredDeviceId', deviceId);
        formData.append('ServerUrl', url);

        if (type == 1) {
            // Register
            formData.append('RegisteredDate', today);
            formData.append('Active', 'true');
            formData.append('IsDeleted', '0');
            formData.append('UnRegisteredDate', today);
        } else if (type == 3) {
            // Logout
            formData.append('RegisteredDate', today);
            formData.append('Active', 'false');
            formData.append('IsDeleted', '1');
            formData.append('UnRegisteredDate', today);
            formData.append('LogOut', 1);
        } else {
            // UnRegister
            formData.append('RegisteredDate', today);
            formData.append('Active', '0');
            formData.append('IsDeleted', '1');
            formData.append('UnRegisteredDate', today);
        }

        console.log('formdata new', formData);
        console.log('API---------->', API_URL + 'RegisterDevice/RegisterDevice');

        fetch(API_URL + 'RegisterDevice/RegisterDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                cb({
                    data,
                });
            })
            .catch(data => {
                cb(false, data);
            });
    },

    getRegistrationList(RegisteredDeviceId, ServerUrl, RegisteredDate, Active, IsDeleted, UnRegisteredDate, cb) {
        // var today = new Date();
        // var dd = today.getDate();
        // var mm = today.getMonth() + 1; //January is 0!
        // var yyyy = today.getFullYear();
        // if (dd < 10) {
        //   dd = "0" + dd;
        // }
        // if (mm < 10) {
        //   mm = "0" + mm;
        // }
        // today = yyyy + "-" + mm + "-" + dd;

        var formData = new FormData();
        formData.append('RegisteredDeviceId', RegisteredDeviceId);
        // formData.append("ServerUrl", ServerUrl);
        // formData.append("RegisteredDate", RegisteredDate);
        // formData.append("Active", Active);
        // formData.append("IsDeleted", IsDeleted);
        // formData.append("UnRegisteredDate", UnRegisteredDate);

        console.log('formData', formData);
        console.log('API---------2-------->', API_URL + 'RegisterDevice/DeviceStatus');

        fetch(API_URL + 'RegisterDevice/DeviceStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                //'Authorization': 'Bearer' + ' ' + token
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpDashboarddata(UserID, SiteId, token, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('SiteId', SiteId);
        formData.append('Token', token);

        console.log('formData', formData);

        fetch(API_URL + 'DashBoard/layout', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('--->', data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
    getapqpPeriodicList(UserID, TaskId, Index, MaxIndex, Token, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('TaskId', TaskId);
        formData.append('Index', Index);
        formData.append('MaxIndex', MaxIndex);

        console.log('formData', formData);
        console.log('---------->API-------->', API_URL + 'PeriodicUpdate/List');

        fetch(API_URL + 'PeriodicUpdate/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpHistoryList(UserID, TaskId, Index, MaxIndex, Token, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('TaskId', TaskId);
        formData.append('Index', Index);
        formData.append('MaxIndex', MaxIndex);

        console.log('formData', formData);

        fetch(API_URL + 'PeriodicUpdate/History', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    onsaveperiodicupdate(Id, UserID, TaskId, FromPercent, Percent, ResourceID, StartDate, Hours, Remark, UpdateType, EndTime, Token, cb) {
        var formData = new FormData();
        formData.append('Id', Id);
        formData.append('UserId', UserID);
        formData.append('TaskId', TaskId);
        formData.append('FromPercent', FromPercent);
        formData.append('Percent', Percent);
        formData.append('ResourceID', ResourceID);
        formData.append('StartDate', StartDate);
        formData.append('Hours', Hours);
        formData.append('Remark', Remark);
        formData.append('UpdateType', UpdateType);
        formData.append('EndTime', EndTime);

        console.log('save formData', formData);
        console.log('save formData', Token);

        fetch(API_URL + 'PeriodicUpdate/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getUpcomingTaskapi(UserID, SiteID, token, cb) {
        var formData = new FormData();
        //formData.append("ProjectId", ProjectId);
        formData.append('UserId', UserID);
        formData.append('SiteID', SiteID);
        // formData.append("ToDate", ToDate);
        // formData.append("TodayTask", TodayTask);

        console.log('getUpcomingTaskapi formData', formData);

        console.log('Upcoming_Task_API---->' + API_URL + 'Calender/UpComingTask');

        fetch(API_URL + 'Calender/UpComingTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getCalendarapi(UserID, SiteID, token, TodayTask, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('SiteID', SiteID);
        formData.append('TodayTask', TodayTask);

        fetch(API_URL + 'Calender/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpDeliverableInfoList(ProjectId, TaskId, ResourceId, AccessType, Token, cb) {
        var formData = new FormData();
        formData.append('ProjectId', ProjectId);
        formData.append('TaskId', TaskId);
        formData.append('Resources', ResourceId);
        formData.append('AccessType', AccessType);

        console.log('formData', formData);

        fetch(API_URL + 'DeliverableInfo/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpOpenListdataapi(UserID, SiteID, Index, MaxRow, ListType, Token, FilterValue, FilterColumn, OrderBy, Sorttype, StartDate, EndDate, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('SiteId', SiteID);
        formData.append('Index', Index);
        formData.append('MaxRow', MaxRow);
        formData.append('ListType', ListType);
        formData.append('FilterValue', FilterValue);
        formData.append('FilterColumn', FilterColumn);
        formData.append('OrderBy', OrderBy);
        formData.append('Sorttype', Sorttype);
        formData.append('StartDate', StartDate);
        formData.append('EndDate', EndDate);

        console.log('formDatasasas', formData);

        fetch(API_URL + 'DashBoard/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpInprogressListdata(UserID, SiteID, Index, MaxRow, ListType, Token, FilterValue, FilterColumn, OrderBy, Sorttype, StartDate, EndDate, cb) {
        var formData = new FormData();
        formData.append('UserID', UserID);
        formData.append('SiteID', SiteID);
        formData.append('Index', Index);
        formData.append('MaxRow', MaxRow);
        formData.append('ListType', ListType);
        formData.append('FilterValue', FilterValue);
        formData.append('FilterColumn', FilterColumn);
        formData.append('OrderBy', OrderBy);
        formData.append('SortType', Sorttype);
        formData.append('StartDate', StartDate);
        formData.append('EndDate', EndDate);

        console.log('getapqpInprogressListdata formData ', formData);
        console.log('getapqpInprogressListdata formData ', Token);

        console.log('API--->' + (API_URL + 'DashBoard/list'));
        fetch(API_URL + 'DashBoard/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpMeetingListdata(SiteID, UserID, Index, Max, Token, FilterValue, FilterColumn, OrderBy, Sorttype, StartDate, EndDate, cb) {
        var formData = new FormData();
        formData.append('SiteId', SiteID);
        formData.append('UserId', UserID);
        formData.append('Index', Index);
        formData.append('Max', Max);
        formData.append('FilterValue', FilterValue);
        formData.append('FilterColumn', FilterColumn);
        formData.append('OrderBy', OrderBy);
        formData.append('Sorttype', Sorttype);
        formData.append('StartDate', StartDate);
        formData.append('EndDate', EndDate);

        console.log('formData', formData);

        fetch(API_URL + 'Meeting/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpMeetingPlanList(ActionId, Token, cb) {
        var formData = new FormData();
        formData.append('ActionId', ActionId);
        console.log('formData', formData);

        fetch(API_URL + 'Meeting/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpRiskListdata(UserID, SiteID, Index, Max, Token, FilterValue, FilterColumn, OrderBy, Sorttype, StartDate, EndDate, cb) {
        var formData = new FormData();
        formData.append('UserId', UserID);
        formData.append('SiteId', SiteID);
        formData.append('Index', Index);
        formData.append('Max', Max);
        formData.append('FilterValue', FilterValue);
        formData.append('FilterColumn', FilterColumn);
        formData.append('OrderBy', OrderBy);
        formData.append('Sorttype', Sorttype);
        formData.append('StartDate', StartDate);
        formData.append('EndDate', EndDate);

        console.log('formData', formData);

        fetch(API_URL + 'RiskAction/List', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    onCompMeetingPlan(ActionId, Status, Token, cb) {
        var formData = new FormData();
        formData.append('ActionId', ActionId);
        formData.append('Status', Status);

        console.log('formData', formData);

        fetch(API_URL + 'Meeting/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpRiskActionList(ActionId, Status, Token, cb) {
        var formData = new FormData();
        formData.append('ActionId', ActionId);
        formData.append('Status', Status);

        console.log('formData', formData);

        fetch(API_URL + 'RiskAction/Edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpMeetingPlanSave(ActionId, Status, Token, cb) {
        var formData = new FormData();
        formData.append('ActionId', ActionId);
        formData.append('Status', Status);

        console.log('formData', formData);

        console.log('API--->' + API_URL + 'Meeting/Save');

        fetch(API_URL + 'Meeting/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getapqpRiskActionSave(ActionId, Status, Token, cb) {
        var formData = new FormData();
        formData.append('ActionId', ActionId);
        formData.append('Status', Status);

        console.log('formData', formData);

        fetch(API_URL + 'RiskAction/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getDocProRequestDetails(ProjectId, TaskId, IsAdditional, UserId, Token, cb) {
        var formData = new FormData();
        formData.append('Project_Id', ProjectId);
        formData.append('TaskId', TaskId);
        formData.append('IsAdditional', IsAdditional);
        formData.append('UserId', UserId);

        console.log('formData', formData);

        fetch(API_URL + 'DeliverableInfo/DropDown', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    saveAttachments(ProjectId, TaskId, InputDocId, DocId, DocRevision, DocName, IPIdentity, ObjId, Comments, isAdditional, Token, cb) {
        var formData = new FormData();
        formData.append('Project_Id', ProjectId);
        formData.append('TaskId', TaskId);
        formData.append('InputDoc_Id', InputDocId);
        formData.append('Doc_Id', DocId);
        formData.append('Doc_Rev_Id', DocRevision);
        formData.append('Doc_Name', DocName);
        formData.append('comment', Comments);
        formData.append('AXN', '2');
        formData.append('id', '');
        formData.append('isadditional', isAdditional);
        formData.append('Doc_desc', Comments);
        formData.append('IPIdentity', IPIdentity);
        formData.append('objID', ObjId);

        console.log('formData', formData);

        fetch(API_URL + 'DeliverableInfo/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer' + ' ' + Token,
            },
            body: formData,
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data);
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    docProAttachment(docProObj, token, cb) {
        fetch(DP_API_URL + 'PublishDocument/PublishDocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + ' ' + token,
            },
            body: JSON.stringify({
                lstPublishDocumentListModel: docProObj,
            }),
        })
            .then(resp => resp.json())
            .then(data => {
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    checkADApi(cb) {
        // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?CheckADInstance=1
        //http://1.22.172.236/APQPApi/

        var activeURL = API_URL;
        var filterURL1 = activeURL.replace('APQPApi', 'EwQIMS');
        var filterURL2 = filterURL1 + '/common/';
        var ADdomain = 'ActiveDirectory/ADCheck.aspx?CheckADInstance=1';

        var response = undefined;

        console.log(filterURL2 + ADdomain);

        fetch(filterURL2 + ADdomain, {
            method: 'POST',
        })
            .then(resp => {
                resp.json().then(res => {
                    cb(res);
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },

    getProfileDetails(token, cb) {
        fetch(API_URL + GetProfile, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + ' ' + token,
            },
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data)
                cb({
                    data,
                });
            })
            .catch(data => {
                cb({
                    //status: cons.ERROR_500
                    status: data,
                });
            });
    },
};
