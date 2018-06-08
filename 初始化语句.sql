/*
DELETE FROM ROLE_SECURITY_RF;

DELETE FROM EMPLOYEE_ROLE_RF;

DELETE FROM ROLE;

DELETE FROM SECURITY;

DELETE FROM MEETING_MEMBER_RF;

DELETE FROM MEETING_MEMBER_ROLE;

DELETE FROM SHORT_MESSAGE_SEND_LOG;

DELETE FROM MESSAGE_SEND_CENTER;

DELETE FROM SHORT_MESSAGE_CENTER;

DELETE FROM MESSAGE_SEND_STATE;

DELETE FROM MEETING_ATTACHMENT;

DELETE FROM MEETING;

DELETE FROM MEETING_STATE;

DELETE FROM MEETING_ROOM;

DELETE FROM ATTACHMENT;
DELETE FROM EMPLOYEE;
DELETE FROM POST;
DELETE FROM SEX;
-- 删除自引用表，要手动执行多次，直到记录为零
DELETE FROM DEPARTMENT 
WHERE
    DEPARTMENT_ID NOT IN (SELECT 
        PARENT_DEPARTMENT_ID
    FROM
        (SELECT 
            PARENT_DEPARTMENT_ID
        FROM
            DEPARTMENT
        
        WHERE
            PARENT_DEPARTMENT_ID IS NOT NULL) AS t);
            
DELETE FROM ATTACHMENT_TEMP;
*/

INSERT INTO DEPARTMENT VALUES ('-1', NULL, '总公司');
INSERT INTO DEPARTMENT VALUES ('0', '-1', '安全部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '业务部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '零售管理部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '非油品业务部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '财务资产部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '经理办公室');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '人力资源部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '党委办公室');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '城区经营管理部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '阳春经营管理部');
INSERT INTO DEPARTMENT VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '阳西经营管理部');

INSERT INTO POST VALUES ('-1', '综合管理员', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '副经理', '主持行政工作');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '副书记', '主持党务工作');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '经理助理', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '部门主任', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '部门副主任', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '主办', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '业务员A', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '业务员B', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '督查队长', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '经营管理部经理', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '经营管理部书记', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '经营管理部副经理', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '经营管理部副书记', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '站长', '');
INSERT INTO POST VALUES (UPPER(REPLACE(UUID(),'-','')), '普通员工', '');

INSERT INTO ROLE VALUES ('-1', '超级管理员');
INSERT INTO ROLE VALUES ('0', '管理员');
INSERT INTO ROLE VALUES ('1', '公司领导');
INSERT INTO ROLE VALUES (UPPER(REPLACE(UUID(),'-','')), '发起部门');
INSERT INTO ROLE VALUES (UPPER(REPLACE(UUID(),'-','')), '参会部门');

INSERT INTO SECURITY VALUES ('100', '100', '会议');
INSERT INTO SECURITY VALUES ('1001', '1001', '会议管理');
INSERT INTO SECURITY VALUES ('10011', '10011', '会议发起');
INSERT INTO SECURITY VALUES ('10012', '10012', '会议修改');
INSERT INTO SECURITY VALUES ('10013', '10013', '会议删除');
INSERT INTO SECURITY VALUES ('10014', '10014', '结束会议');
INSERT INTO SECURITY VALUES ('10015', '10015', '查看会议');

INSERT INTO SECURITY VALUES ('1002', '1002', '材料检索');
INSERT INTO SECURITY VALUES ('10021', '10021', '材料上传');
INSERT INTO SECURITY VALUES ('10022', '10022', '材料删除');
INSERT INTO SECURITY VALUES ('10023', '10023', '材料下载');

INSERT INTO SECURITY VALUES ('1003', '1003', '会议室设置');
INSERT INTO SECURITY VALUES ('10031', '10031', '会议室增加');
INSERT INTO SECURITY VALUES ('10032', '10032', '会议室修改');
INSERT INTO SECURITY VALUES ('10033', '10033', '会议室删除');

INSERT INTO SECURITY VALUES ('200', '200', '权限');
INSERT INTO SECURITY VALUES ('2001', '2001', '角色管理');
INSERT INTO SECURITY VALUES ('20011', '20011', '职务增加');
INSERT INTO SECURITY VALUES ('20012', '20012', '职务修改');
INSERT INTO SECURITY VALUES ('20013', '20013', '职务删除');

INSERT INTO SECURITY VALUES ('2002', '2002', '部门管理');
INSERT INTO SECURITY VALUES ('20021', '20021', '部门增加');
INSERT INTO SECURITY VALUES ('20022', '20022', '部门修改');
INSERT INTO SECURITY VALUES ('20023', '20023', '部门删除');

INSERT INTO SECURITY VALUES ('2003', '2003', '用户管理');
INSERT INTO SECURITY VALUES ('20031', '20031', '用户增加');
INSERT INTO SECURITY VALUES ('20032', '20032', '用户修改');
INSERT INTO SECURITY VALUES ('20033', '20033', '用户删除');
INSERT INTO SECURITY VALUES ('20034', '20034', '密码修改');

INSERT INTO SECURITY VALUES ('2004', '2004', '职务管理');
INSERT INTO SECURITY VALUES ('20041', '20041', '角色增加');
INSERT INTO SECURITY VALUES ('20042', '20042', '角色修改');
INSERT INTO SECURITY VALUES ('20043', '20043', '角色删除');
INSERT INTO SECURITY VALUES ('20044', '20044', '角色保存');
INSERT INTO SECURITY VALUES ('20045', '20045', '角色重置');
INSERT INTO SECURITY VALUES ('20046', '20046', '角色全选');

INSERT INTO SECURITY VALUES ('300', '300', '系统设置');
INSERT INTO SECURITY VALUES ('3001', '3001', '短信中心设置');
INSERT INTO SECURITY VALUES ('30011', '30011', '短信中心保存');
INSERT INTO SECURITY VALUES ('30012', '30012', '测试短息发送');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '100');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '1001');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10011');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10012');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10013');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10014');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10015');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '1002');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10021');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10022');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10023');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '1003');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10031');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10032');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '10033');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '200');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '2001');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20011');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20012');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20013');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '2002');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20021');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20022');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20023');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '2003');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20031');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20032');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20033');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20034');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '2004');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20041');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20042');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20043');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20044');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20045');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '20046');

INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '300');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '3001');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '30011');
INSERT INTO ROLE_SECURITY_RF VALUES (UPPER(REPLACE(UUID(),'-','')), '-1', '30012');


INSERT INTO SEX VALUES ('0', '01', '男');
INSERT INTO SEX VALUES ('1', '02', '女');

INSERT INTO MEETING_MEMBER_ROLE VALUES ('0', '01', '会议发起人');
INSERT INTO MEETING_MEMBER_ROLE VALUES ('1', '02', '会议主持人');
INSERT INTO MEETING_MEMBER_ROLE VALUES ('2', '03', '其它参会人员');

INSERT INTO ATTACHMENT_CATEGORY VALUES ('0', '01', '普通附件');
INSERT INTO ATTACHMENT_CATEGORY VALUES ('1', '02', '会议记录');

INSERT INTO MEETING_STATE VALUES ('0', '01', '已发起');
INSERT INTO MEETING_STATE VALUES ('1', '02', '已结束');

INSERT INTO MESSAGE_SEND_STATE VALUES ('0', '01', '未发送');
INSERT INTO MESSAGE_SEND_STATE VALUES ('1', '02', '发送失败');
INSERT INTO MESSAGE_SEND_STATE VALUES ('2', '03', '发送成功');

INSERT INTO EMPLOYEE VALUES ('100000','-1','0','0','admin','00509c4eee4657da3350647879179e3e','管理员',NULL,NULL);
INSERT INTO EMPLOYEE_ROLE_RF VALUES (UPPER(REPLACE(UUID(),'-','')),'100000','-1');

INSERT INTO SHORT_MESSAGE_CENTER(SHORT_MESSAGE_CENTER_ID,SHORT_MESSAGE_CENTER_NAME,SEND_URL,CALLER_ID,CALLER_PASSWORD,MESSAGE_TEMPLATE_ID,MESSAGE_MODEL)
VALUES (UPPER(REPLACE(UUID(),'-','')),'中国移动','http://120.197.89.93:80/EOPS1.0/notice/send','51918000028','e78e4044b4ff2db45d8ab7fda4634044','4028528463b74a0d0163d41523b10033','{@meetingStartTime},{@meetingRoomName},{@meetingSubject}');