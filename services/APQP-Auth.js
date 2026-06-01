import api from "./APQP-API";

export default {
  setServerUrl(serverUrl) {
    api.setServerUrl(serverUrl);
  },

  getapqplist(
    UserID,
    SiteId,
    Index,
    maxRow,
    ListType,
    projectView,
    FilterValue,
    FilterColumn,
    OrderBy,
    Sorttype,
    StartDate,
    EndDate,
    Token,
    cb
  ) {
    api.getapqp(
      UserID,
      SiteId,
      Index,
      maxRow,
      ListType,
      projectView,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  filterapqplist(
    UserID,
    SiteId,
    Index,
    maxRow,
    ListType,
    projectView,
    startDate,
    endDate,
    Token,
    cb
  ) {
    api.filterapqp(
      UserID,
      SiteId,
      Index,
      maxRow,
      ListType,
      projectView,
      startDate,
      endDate,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqplist2data(
    UserID,
    ProjectId,
    TaskId,
    MaxRow,
    ListType,
    ProjectView,
    Token,
    cb
  ) {
    api.getapqp2(
      UserID,
      ProjectId,
      TaskId,
      MaxRow,
      ListType,
      ProjectView,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqplogindata(UserName, Password, cb) {
    api.getLogin(UserName, Password, (res) => {
      cb(true, res);
    });
  },
  getapqpweblogindata(docattachurl, UserName, Password, cb) {
    api.webLogin(docattachurl, UserName, Password, (res) => {
      cb(true, res);
    });
  },

  getRegistrationdata(
    RegisteredDeviceId,
    ServerUrl,
    RegisteredDate,
    Active,
    IsDeleted,
    UnRegisteredDate,
    cb
  ) {
    api.getRegistrationList(
      RegisteredDeviceId,
      ServerUrl,
      RegisteredDate,
      Active,
      IsDeleted,
      UnRegisteredDate,
      (res) => {
        cb(true, res);
      }
    );
  },

  registerDevice(RegisteredDeviceId, ServerUrl, type, cb) {
    api.registerDevice(RegisteredDeviceId, ServerUrl, type, (res) => {
      cb(true, res);
    });
  },

  getapqpDashboarddata(UserID, SiteId, Token, cb) {
    api.getapqpDashboarddata(UserID, SiteId, Token, (res) => {
      cb(true, res);
    });
  },

  getapqpPeriodicList(UserID, TaskId, Index, MaxIndex, Token, cb) {
    api.getapqpPeriodicList(UserID, TaskId, Index, MaxIndex, Token, (res) => {
      cb(true, res);
    });
  },

  getapqpHistoryList(UserID, TaskId, Index, MaxIndex, Token, cb) {
    api.getapqpHistoryList(UserID, TaskId, Index, MaxIndex, Token, (res) => {
      cb(true, res);
    });
  },

  saveperiodicupdate(
    Id,
    UserID,
    TaskId,
    FromPercent,
    Percent,
    ResourceID,
    StartDate,
    Hours,
    Remark,
    UpdateType,
    EndTime,
    Token,
    cb
  ) {
    api.onsaveperiodicupdate(
      Id,
      UserID,
      TaskId,
      FromPercent,
      Percent,
      ResourceID,
      StartDate,
      Hours,
      Remark,
      UpdateType,
      EndTime,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  calendarapi(UserID, SiteID, token, TodayTask, cb) {
    api.getCalendarapi(UserID, SiteID, token, TodayTask, (res) => {
      cb(true, res);
    });
  },

  //getUpcomingTaskapi

  getUpcomingTaskapi(UserID, SiteID, token, cb) {
    api.getUpcomingTaskapi(UserID, SiteID, token, (res) => {
      cb(true, res);
    });
  },

  getapqpDeliverableInfoList(
    ProjectId,
    TaskId,
    ResourceId,
    AccessType,
    Token,
    cb
  ) {
    api.getapqpDeliverableInfoList(
      ProjectId,
      TaskId,
      ResourceId,
      AccessType,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqpOpenListdata(
    UserID,
    SiteID,
    Index,
    MaxRow,
    ListType,
    Token,
    FilterValue,
    FilterColumn,
    OrderBy,
    Sorttype,
    StartDate,
    EndDate,
    cb
  ) {
    api.getapqpOpenListdataapi(
      UserID,
      SiteID,
      Index,
      MaxRow,
      ListType,
      Token,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqpInprogressListdata(
    UserID,
    SiteID,
    Index,
    MaxRow,
    ListType,
    Token,
    FilterValue,
    FilterColumn,
    OrderBy,
    Sorttype,
    StartDate,
    EndDate,
    cb
  ) {
    api.getapqpInprogressListdata(
      UserID,
      SiteID,
      Index,
      MaxRow,
      ListType,
      Token,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqpMeetingListdata(
    SiteID,
    UserID,
    Index,
    Max,
    Token,
    FilterValue,
    FilterColumn,
    OrderBy,
    Sorttype,
    StartDate,
    EndDate,
    cb
  ) {
    api.getapqpMeetingListdata(
      SiteID,
      UserID,
      Index,
      Max,
      Token,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqpMeetingPlanList(ActionId, token, cb) {
    api.getapqpMeetingPlanList(ActionId, token, (res) => {
      cb(true, res);
    });
  },

  getonCompMeetingPlan(ActionId, Status, Token, cb) {
    api.onCompMeetingPlan(ActionId, Status, Token, (res) => {
      cb(true, res);
    });
  },

  getapqpRiskListdata(
    UserID,
    SiteID,
    Index,
    Max,
    Token,
    FilterValue,
    FilterColumn,
    OrderBy,
    Sorttype,
    StartDate,
    EndDate,
    cb
  ) {
    api.getapqpRiskListdata(
      UserID,
      SiteID,
      Index,
      Max,
      Token,
      FilterValue,
      FilterColumn,
      OrderBy,
      Sorttype,
      StartDate,
      EndDate,
      (res) => {
        cb(true, res);
      }
    );
  },

  getapqpRiskActionList(ActionId, Status, Token, cb) {
    api.getapqpRiskActionList(ActionId, Status, Token, (res) => {
      cb(true, res);
    });
  },

  getapqpMeetingPlanSave(ActionId, Status, Token, cb) {
    api.getapqpMeetingPlanSave(ActionId, Status, Token, (res) => {
      cb(true, res);
    });
  },

  getapqpRiskActionSave(ActionId, Status, Token, cb) {
    api.getapqpRiskActionSave(ActionId, Status, Token, (res) => {
      cb(true, res);
    });
  },

  getDocProRequestDetails(ProjectId, TaskId, IsAdditional, UserId, Token, cb) {
    api.getDocProRequestDetails(
      ProjectId,
      TaskId,
      IsAdditional,
      UserId,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  saveAttachments(
    ProjectId,
    TaskId,
    InputDocId,
    DocId,
    DocRevision,
    DocName,
    IPIdentity,
    ObjId,
    Comments,
    isAdditional,
    Token,
    cb
  ) {
    api.saveAttachments(
      ProjectId,
      TaskId,
      InputDocId,
      DocId,
      DocRevision,
      DocName,
      IPIdentity,
      ObjId,
      Comments,
      isAdditional,
      Token,
      (res) => {
        cb(true, res);
      }
    );
  },

  outputAttachments(
    IPDocId,
    IPIdentity,
    OPDocId,
    OPIdentity,
    ProjectID,
    RevId,
    TaskId,
    UserDocName,
    FileName,
    FilePath,
    ext,
    UserId,
    siteid,
    WebToken,
    weburl,
    comments,
    isAdditional,
    cb
  ) {
    api.outputAttachments(
      IPDocId,
      IPIdentity,
      OPDocId,
      OPIdentity,
      ProjectID,
      RevId,
      TaskId,
      UserDocName,
      FileName,
      FilePath,
      ext,
      UserId,
      siteid,
      WebToken,
      weburl,
      comments,
      isAdditional,
      (res) => {
        cb(true, res);
      }
    );
  },

  getdocProAttachment(docProObj, token, cb) {
    api.docProAttachment(docProObj, token, (res) => {
      cb(true, res);
    });
  },
  getActiveDirectory(cb) {
    api.checkADApi((res) => {
      cb(true, res);
    });
  },

  getProfile(token, cb) {
    api.getProfileDetails(token, (res) => {
      cb(true, res);
    });
  },

  postimage(filename, filecontent, token, cb) {
    api.uploadattachment(filename, filecontent, token, (res) => {
      cb(true, res);
    });
  },
};
