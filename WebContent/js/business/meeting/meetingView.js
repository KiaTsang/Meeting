/**
 * FileName: meetingView.js
 * File description: 用于加载和初始化会议配置页面的组件及内容
 * Copyright (c) 2018 Kia, Inc. All Rights Reserved.
 *
 * @author <a href="mailto:kiatsang@163.com">kia</a>
 * @DateTime: 2018-05-21
 */

/**
 * meetingView
 * @type {meetingView}
 */
var meetingView = function () {
    var meetingId = null;
    var zTreeObj = null;
    var selectedTreeNode = null;
    var searchLocationIndex = 0;
    var meetingRecordFilesTable = null;
    var meetingFilesTable = null;

    var handlePageInfo = function () {
        var tmpUrl = document.URL;
        var tmpUrlParam = tmpUrl.split('?')[1];
        if (tmpUrlParam != undefined) {
            var tmpUrlParamValue= tmpUrlParam.split("=")[1];
            if (tmpUrlParamValue != undefined && tmpUrlParamValue != null) {
                var obj = [];
                obj.push(StringUtil.decorateRequestData('String',tmpUrlParamValue));
                $.ajax({
                    type:'post',
                    Type:"json",
                    async:false,
                    url:SMController.getUrl({controller:'controllerProxy',method:'callBack'
                        ,proxyClass:'meetingController',proxyMethod:'getMeetingInfoById',jsonString:MyJsonUtil.obj2str(obj)}),
                    success:function(result){
                        var tmpJsonObject = JSON.parse(result);
                        DomUtil.setFormElementsValueViaJSONObject('meetingForm',tmpJsonObject);
                        $('#meetingPresenter').select2('val',tmpJsonObject.meetingPresenter);
                        if (tmpJsonObject.isSendMessageNotice == 1)
                            $('input[name="isSendMessageNotice"]').prop('checked',true);

                        if (tmpJsonObject.messageNoticeTime == "" || tmpJsonObject.messageNoticeTime == null) {
                            $('input[name="noticeTypeId"]').eq("0").prop("checked", "checked");
                        } else {
                            $('input[name="noticeTypeId"]').eq("1").prop("checked", "checked");
                        }
                        $('input[name="noticeTypeId"]').attr('disabled',true);

                        if (tmpJsonObject.meetingFileList.length > 0)
                            meetingFilesTable.fnAddData(tmpJsonObject.meetingFileList);
                        if (tmpJsonObject.meetingRecordFileList.length > 0)
                            meetingRecordFilesTable.fnAddData(tmpJsonObject.meetingRecordFileList);
                    }
                });
            }
        }
    }

    var handleDatePickers = function () {
        $("#messageNoticeTime,#meetingStartTime,#meetingEndTime,#meetingProposeTime").datetimepicker({
            language:'zh-CN',
            format: "yyyy-mm-dd hh:ii:ss"
        });
    }

    var handleTable = function () {
        // 表头定义
        var meetingFilesTableHead = [
            { "sTitle": '<input type="checkbox" id="meetingFilesCheckAll"/>',"bSortable":false,"sWidth": "12px" },
            { "sTitle": "附件ID", "mData": "attachmentId","bVisible":false},
            { "sTitle": "材料名称","mData": "attachmentName"},
            { "sTitle": "上传人", "mData": "employeeName"},
            { "sTitle": "上传部门", "mData": "departmentName"},
            { "sTitle": "上传时间", "mData": "attachmentCreateTime"}
        ];

        var meetingRecordFilesTableHead = [
            { "sTitle": '<input type="checkbox" id="meetingRecordFilesCheckAll"/>',"bSortable":false,"sWidth": "12px" },
            { "sTitle": "附件ID", "mData": "attachmentId","bVisible":false},
            { "sTitle": "材料名称","mData": "attachmentName"},
            { "sTitle": "上传人", "mData": "employeeName"},
            { "sTitle": "上传部门", "mData": "departmentName"},
            { "sTitle": "上传时间", "mData": "attachmentCreateTime"}
        ];

        meetingFilesTable = $('#meetingFiles').dataTable({
            //表头设置
            "aoColumns": meetingFilesTableHead,
            "bAutoWidth" : true,
            "paging": false,
            "info": false,
            "oLanguage": { //国际化一些配置
                "sLoadingRecords" : "正在获取数据，请稍候...",
                "sZeroRecords" : "没有您要搜索的内容"
            },
            "aoColumnDefs": [
                {   //第一列的值为combox
                    "aTargets": [0],
                    "mRender": function (data, type, full ) {
                        return'<input type="checkbox" class="checkboxes"/>';
                    }
                }
            ]
        });

        meetingRecordFilesTable = $('#meetingRecordFiles').dataTable({
            //表头设置
            "aoColumns": meetingRecordFilesTableHead,
            "bAutoWidth" : true,
            "paging": false,
            "info": false,
            "oLanguage": { //国际化一些配置
                "sLoadingRecords" : "正在获取数据，请稍候...",
                "sZeroRecords" : "没有您要搜索的内容"
            },
            "aoColumnDefs": [
                {   //第一列的值为combox
                    "aTargets": [0],
                    "mRender": function (data, type, full ) {
                        return'<input type="checkbox" class="checkboxes"/>';
                    }
                }
            ]
        });

        //复选框全选
        $('#meetingFilesCheckAll').on('click', function (e) {
            var isCheck = $('#meetingFilesCheckAll').prop('checked');
            if(isCheck){
                $('#meetingFiles :checkbox').each(function(){
                    $(this).prop("checked","true");
                });
            }else{
                $('#meetingFiles :checkbox').each(function(){
                    $(this).removeAttr("checked");
                });
            }
        });

        //复选框全选
        $('#meetingRecordFilesCheckAll').on('click', function (e) {
            var isCheck = $('#meetingRecordFilesCheckAll').prop('checked');
            if(isCheck){
                $('#meetingRecordFiles :checkbox').each(function(){
                    $(this).prop("checked","true");
                });
            }else{
                $('#meetingRecordFiles :checkbox').each(function(){
                    $(this).removeAttr("checked");
                });
            }
        });
    }

    var handleButton = function() {
        $('#meetingRecordFileDownloadBtn').on('click', function (e) {
            var isDownload = true;
            var selectMeetingRecordFiles = [];
            var tmpLastSelectMeetingRecordFile = null;
            $('#meetingRecordFiles :checkbox').each(function(){
                if($(this).prop("checked") && $(this).prop("id") == "") {
                    var tr = $(this).parents('tr');
                    var tmpRowData = meetingRecordFilesTable.fnGetData(tr);
                    // 如果不是发起人、管理员、领导，则只允许下载自己的会议材料
                    if(JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('-1') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('0') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('1') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).employeeId == $('input[name="meetingCreator"]').val()
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).employeeId == tmpRowData.employeeId) {
                        selectMeetingRecordFiles.push(tmpRowData.attachmentId);
                        tmpLastSelectMeetingRecordFile = tmpRowData.attachmentName;
                    } else {
                        $.pnotify({
                            text: '只允许下载自己的会议材料'
                        });
                        isDownload = false;
                        return false;
                    }
                }
            });
            if (isDownload) {
                if (selectMeetingRecordFiles.length == 0) {
                    $.pnotify({
                        text: '请勾选需要下载的记录'
                    });
                }else{
                    $.blockUI({
                        message: '<div class="progress progress-lg progress-striped active" style="margin-bottom: 0px;">' +
                            '<div style="width: 100%" role="progressbar" class="progress-bar bg-color-darken">' +
                            '<span id="processStatus" style="position: relative; top: 5px;font-size:15px;">正在下载文件，请稍候...</span></div>' +
                            '</div>'
                    });
                    var obj = [];
                    obj.push(StringUtil.decorateRequestData('List',selectMeetingRecordFiles));
                    // 下载文件数是否为1、文件名后缀是否为文本类型,使用文件流返回的方式下载文件（解决IE浏览器下载时直接打开文件的问题）
                    if (selectMeetingRecordFiles.length == 1 && isTextType(tmpLastSelectMeetingRecordFile)) {
                        var url = SMController.getUrl({controller:'controllerProxy',method:'callBackByRequestAndResponse'
                            ,proxyClass:'attachmentController',proxyMethod:'downloadFile',
                            jsonString:MyJsonUtil.obj2str(obj)},"../../");
                        var temp = document.createElement("form");
                        temp.action = url;
                        temp.method = "post";
                        temp.style.display = "none";
                        document.body.appendChild(temp);
                        temp.submit();
                        $.unblockUI();
                    } else {
                        $.ajax({
                            type:'post',
                            dataType:"json",
                            url: SMController.getUrl({controller:'controllerProxy',method:'callBack'
                                ,proxyClass:'attachmentController',proxyMethod:'downloadFile',
                                jsonString:MyJsonUtil.obj2str(obj)}),
                            success:function(result){
                                $.unblockUI();
                                window.location.href = '../../../'+result;
                            }
                        });
                    }
                }
            }
        });

        $('#meetingFileDownloadBtn').on('click', function (e) {
            var isDownload = true;
            var selectMeetingFiles = [];
            var tmpLastSelectMeetingFile = null;
            $('#meetingFiles :checkbox').each(function(){
                if($(this).prop("checked") && $(this).prop("id") == "") {
                    var tr = $(this).parents('tr');
                    var tmpRowData = meetingFilesTable.fnGetData(tr);
                    // 如果不是发起人、管理员、领导，则只允许下载自己的会议材料
                    if(JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('-1') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('0') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).roleIdList.indexOf('1') > -1
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).employeeId == $('input[name="meetingCreator"]').val()
                        || JSON.parse(sessionStorage.getItem("EmployeeDTO")).employeeId == tmpRowData.employeeId) {
                        selectMeetingFiles.push(tmpRowData.attachmentId);
                        tmpLastSelectMeetingFile = tmpRowData.attachmentName;
                    } else {
                        $.pnotify({
                            text: '只允许下载自己的会议材料'
                        });
                        isDownload = false;
                        return false;
                    }
                }
            });
            if (isDownload) {
                if (selectMeetingFiles.length == 0) {
                    $.pnotify({
                        text: '请勾选需要下载的记录'
                    });
                }else{
                    $.blockUI({
                        message: '<div class="progress progress-lg progress-striped active" style="margin-bottom: 0px;">' +
                            '<div style="width: 100%" role="progressbar" class="progress-bar bg-color-darken">' +
                            '<span id="processStatus" style="position: relative; top: 5px;font-size:15px;">正在下载文件，请稍候...</span></div>' +
                            '</div>'
                    });
                    var obj = [];
                    obj.push(StringUtil.decorateRequestData('List',selectMeetingFiles));
                    // 下载文件数是否为1、文件名后缀是否为文本类型,使用文件流返回的方式下载文件（解决IE浏览器下载时直接打开文件的问题）
                    if (selectMeetingFiles.length == 1 && isTextType(tmpLastSelectMeetingFile)) {
                        var url = SMController.getUrl({controller:'controllerProxy',method:'callBackByRequestAndResponse'
                            ,proxyClass:'attachmentController',proxyMethod:'downloadFile',
                            jsonString:MyJsonUtil.obj2str(obj)},"../../");
                        var temp = document.createElement("form");
                        temp.action = url;
                        temp.method = "post";
                        temp.style.display = "none";
                        document.body.appendChild(temp);
                        temp.submit();
                        $.unblockUI();
                    } else {
                        $.ajax({
                            type:'post',
                            dataType:"json",
                            url: SMController.getUrl({controller:'controllerProxy',method:'callBack'
                                ,proxyClass:'attachmentController',proxyMethod:'downloadFile',
                                jsonString:MyJsonUtil.obj2str(obj)}),
                            success:function(result){
                                $.unblockUI();
                                window.location.href = '../../../'+result;
                            }
                        });
                    }
                }
            }
        });
    }

    return {
        init: function () {
            handleTable();
            handleButton();
            handlePageInfo();
        }
    };
}();