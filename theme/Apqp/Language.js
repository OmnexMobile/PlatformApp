// ES6 module syntax
import LocalizedStrings from "react-native-localization";

export let strings = new LocalizedStrings({
  "en-US": {
    err_percentage:
      "Percentage should be greater than the existing percentage!",
    //Dashboard
    youhave: "You have",
    Calendar: "Calendar",
    todaystask: "Today's Task",
    notask: "No Task",
    welcome: "Welcome",
    recenttask: "Recent Action(s)",
    title_logout: "Confirm Logout",
    title_logout_message: "Are you sure you want to logout?",
    LogoutFailed: "Logout failed!",
    PleaseWait: "Please, wait...",
    LoggingOut: "Logging out",
    yes: "Yes",
    no: "No",
    completed: "Completed",
    risks: "Risks",
    documents: "Documents",
    meetings: "Meetings",
    noactions: "No Activity",
    norecentactivity: "No Recent Activity",
    APQPManager: "APQP/PPAP",
    upcoming_task: "Upcoming Task",
    pending_task: "Pending Task",

    //FOOTER
    home: "Home",
    more: "more...",
    More: "More",
    Profile: "Profile",
    settings: "Settings",
    help: "Help",
    logout: "Logout",
    Cancel: "Cancel",

    //Action Tab List
    Project_List_Failed: "Connection Error!",
    filter: "Filter",
    projects: "Projects",
    allprojects: "All Projects",
    recentProjects: "Recent Projects",
    todaysprojects: "Today's Projects",
    Back: "Back",
    Actions: "Actions",
    All: "All",
    inprogress: "In Progress",
    open: "Open",
    dailyTask: "Daily Task",
    SortByStartDate: "Start Date",
    SortByEndDate: "End Date",
    No_records_found: "No records found!",
    Project_List_Failed: "Connection Error!",
    DueByDays: "Due by Days",
    reset: "Reset",

    //Offline status
    Offline_Notice: "Please Switch OFF the Offline mode to proceed!",

    //Launch Screen
    Swipe: "Swipe the KEY to",
    unlock: "unlock your login",

    //LoginScreen
    Username: "Username",
    Password: "Password",
    Login: "Login",
    LoginCred: "Please provide a login credentials!",
    NoInternet: "No Internet Connection found!",
    usernotallowed: "User not allowed to login",
    InvalidCred: "Invalid login credentials!",
    NullUnm: "Username cannot be empty!",
    EmailInvalid: "Email is not valid!",
    PwdNull: "Password cannot be empty",
    Passwordlengthcannotbelessthan: "Password length cannot be less than 8",
    Passwordshouldnotcontainspecialcharacters:
      "Password should not contain special characters",
    loginpleaseWait: "Logging in... Please wait...",

    //Registration
    Server_Url: "Server Url",
    NotReg:
      "Your device is not registered with us! Please register to proceed.",
    MaxCon:
      "Maximum allowed registration count is reached. Please contact administrator for more details!",
    Unreg: "Your device is unregistered.",
    DevRegFail:
      "Device registration failed! Please contact your administrator for details.",
    DevError:
      "Error connecting to server!. Make sure you have entered correct URL.",
    InvURL: "Server Url is invalid!",
    EmptyURL: "Server Url cannot be empty!",

    //UnRegister
    Register: "Register",
    Unregister: "Unregister",

    //Action Page
    Meeting_Details: "Meeting Details",
    Risk_Details: "Risk Details",
    Project_Details: "Project Details",
    description: "Description",
    actionType: "Action Type",
    StartDate: "Start Date",
    EndDate: "End Date",
    site: "Site",
    Action_Status: "Action Status",
    Project_Owner: "Project Owner",
    Percent: "Percentage",

    //Task List Page
    Deliverables: "Deliverables",

    //Periodic Update
    Progress_Update: "Progress Update",

    //Periodic Edit
    mandate_message: "Please fill all mandatory fields.",
    Save_Message: "Saved successfully!",
    Save_Message_update: "Data is saved successfully and ",
    mail_sent_to : "mail sent to",
    Invalid_Percentage: "Completed Percentage as some invalid characters",
    Invalid_Hours: "Hours as some invalid characters",
    Title_Periodic_Edit: "Periodic Edit",
    Title_Periodic_Add: "Periodic Add",
    Publish: "Publish",
    Hours: "Hour(s)",
    ClientName: "Client Name",
    TypeofWorkConducted: "Type of Work Conducted",
    AnyOpportunities: "Any Opportunities for Future Business Revealed ",
    IssueFaced: "Issue Faced",
    Remarks: "Remarks",
    Please_Choose_Start_Date: "Please choose Start Date",
    Please_Choose_End_Date: "Please choose End Date",
    Close: "Close",
    next: "Next",
    previous: "Previous",
    Save: "Save",
    err_startdate: "Start Date should not be future date.",
    err_enddate: "End Date should not be future date or greater than Start Date",

    //Periodic History
    Periodic_History: "Periodic History",
    Add: "Add",
    Update: "Update",
    From: "From",
    Updated_By: "Updated By",
    Updated_On: "Updated On",

    //APQP/PPAP Manager Screen
    To_Be_Completed: "To be Completed",
    Pending: "Pending",
    Enter_Progress: "* Enter the cumulative progress percentage",
    Percentage_update:"Percentage update",
    Quick_percentage_update: "Quick percentage update",

    //Risk Action
    Risk_Action: "Risk Action",

    //Daily Task
    noactivity: "No Activity",

    //User Preference
    UserSetting: "Settings",
    UserSetHeader: "User Preference",
    OfflineMode: "Offline Mode",
    OfflineModeDesc: "Manually connect/disconnect internet connection",
    ChooseTab: "Choose your preferred settings",
    SaveToast: "Default date format is changed successfully",
    SaveOfflineEnabledToast: "Offline mode enabled successfully",
    SaveOfflineDisabledToast: "Offline mode disabled successfully",
    LabelText: "Choose date format",
    prefferedsettings: "Preferred Settings",

    //
    to: "to",

    //Profile
    Company_URL: "Company URL",
    Phone: "Phone",
    Address: "Address",

    /* Filter Screen*/
    filter: "Filter",
    apply: "Apply",
    clearall: "Clear All",
    date: "Date",
    search: "Search",
    PleasechoosestartDateandEndDatefromcalendar:
      "Please choose Start Date and End Date from calendar",
    DateRangeHeading: "Select Date Range",
    nofilterapply: "No filter applied",
  },

  zh: {
    err_percentage:
      "Percentage should be greater than the existing percentage!日",

    /* Profile */
    Company_URL: "公司网址",
    Phone: "电话",
    Address: "地址",

    /* Filter screen*/
    filter: "过滤",
    apply: "应用",
    clearall: "全部清除",
    date: "日期",
    search: "搜索",
    PleasechoosestartDateandEndDatefromcalendar:
      "请从日历中选择StartDate和EndDate",
    DateRangeHeading: "选择日期范围",
    nofilterapply: "未应用过滤器",

    //
    to: "至",

    //User Preference
    UserSetting: "设置",
    UserSetHeader: "用户偏好",
    OfflineMode: "离线模式",
    OfflineModeDesc: "手动连接/断开Internet连接",
    ChooseTab: "选择首选设置",
    SaveToast: "默认日期格式已成功更改",
    SaveOfflineEnabledToast: "脱机模式成功启用",
    SaveOfflineDisabledToast: "脱机模式已成功禁用",
    LabelText: "选择日期格式",
    prefferedsettings: "首选设置",

    //Daily Task
    noactivity: "No Activity日",

    //Risk Action
    Risk_Action: "Risk Action日",

    //APQP/PPAP Manager Screen
    To_Be_Completed: "要完成的",
    Pending: "有待",
    Enter_Progress: "* Enter the cumulative progress percentage日",
    Percentage_update:"Percentage update日",
    Quick_percentage_update: "Quick percentage update日",

    //Periodic History
    Periodic_History: "Periodic History日",
    Add: "创建",
    Update: "更新资料",
    From: "从",
    Updated_By: "更新者",
    Updated_On: "更新于",

    //Periodic Edit
    mandate_message: "请填写所有必填字段。",
    Save_Message: "保存成功！",
    Invalid_Percentage: "Completed Percentage as some invalid Characters日",
    Invalid_Hours: "Hours as some invalid characters日",
    Title_Periodic_Edit: "Periodic Edit日",
    Title_Periodic_Add: "Periodic Add日",
    Hours: "Hours日",
    ClientName: "Client Name日",
    TypeofWorkConducted: "Type of Work Conducted日",
    AnyOpportunities: "Any Opportunities for Future Buisiness Revealed 日",
    IssueFaced: "Issue Faced日",
    Remarks: "Remarks日",
    Please_Choose_Start_Date: "请选择 Start Date",
    Please_Choose_End_Date: "请选择  End Date",
    Close: "关",
    next: "下一个",
    previous: "以前",
    Save: "保存",

    //Periodic Update
    Progress_Update: "Progress Update日",

    //Task List Page
    Deliverables: "Deliverables日",

    //Action Page
    Action_Details: "Meeting Details日",
    Risk_Details: "Risk Details日",
    Project_Details: "Project Details日",
    description: "描述",
    StartDate: "开始日期",
    EndDate: "结束日期",
    site: "Site日",
    Action_Status: "Action Status日",
    Project_Owner: "Project Owner日",
    Percent: "Percentage日",

    //Dashboard
    youhave: "你有",
    Calendar: "日历",
    todaystask: "Today's Task日",
    notask: "No Task日",
    welcome: "欢迎",
    recenttask: "Recent Action(s)日",
    title_logout: "确认 登出",
    title_logout_message: "您确定要退出吗?",
    LogoutFailed: "注销失败!",
    yes: "是",
    no: "没有",
    risks: "Risks日",
    meetings: "Meetings日",
    documents: "Documents日",
    completed: "已完成",
    noactions: "No Activity日",
    norecentactivity: "没有近期活动",
    APQPManager: "APQP/PPAP日",

    //FOOTER
    home: "家",
    more: "更多...",
    More: "更多",
    Profile: "轮廓",
    settings: "设定值",
    help: "救命",
    logout: "登出",
    Cancel: "取消",

    //Action Tab List
    Project_List_Failed: "无法下载审核列表!",
    filter: "过滤",
    projects: "Projects日",
    allprojects: "All Projects日",
    recentProjects: "Recent Projects日",
    todaysprojects: "Today's Projects日",
    Back: "Back日",
    Actions: "Actions日",
    All: "所有",
    inprogress: "进行中",
    open: "Open日",
    dailyTask: "Daily Task日",
    SortByStartDate: "开始日期",
    SortByEndDate: "结束日期",
    No_records_found: "没有找到记录 !",
    Project_List_Failed: "无法下载审核列表!",
    DueByDays: "Due by Days日",
    reset: "重启",

    //Offline status
    Offline_Notice: "请关闭离线模式以继续!",

    //Launch Screen
    Swipe: "将键滑动到",
    unlock: "解锁你的登录",

    //LoginScreen
    Username: "用户名",
    Password: "密码",
    Login: "登录",
    LoginCred: "请提供登录凭据！",
    NoInternet: "找不到互联网连接！",
    usernotallowed: "不允许用户登录",
    InvalidCred: "无效的登录凭证！",
    NullUnm: "用户名不能为空！",
    EmailInvalid: "电子邮件无效！",
    PwdNull: "密码不能为空",
    asswordlengthcannotbelessthan: "密码长度不能小于8",
    asswordshouldnotcontainspecialcharacters: "密码不能包含特殊字符",
    loginpleaseWait: "正在登录... 请稍候...",

    //Registration
    Server_Url: "服务器网址",
    NotReg: "您的设备未在我们这里注册！请注册继续。",
    MaxCon: "达到最大允许注册次数。请联系管理员了解更多详情！",
    Unreg: "Your device is unregistered.",
    DevRegFail: "设备注册失败！请联系您的管理员了解详情。",
    DevError: "连接服务器时出错！请检查您的互联网连接，然后重试。",
    InvURL: "服务器网址无效！",
    EmptyURL: "服务器网址不能为空！",

    //UnRegister
    Register: "寄存器",
    Unregister: "注销",
  },
});
