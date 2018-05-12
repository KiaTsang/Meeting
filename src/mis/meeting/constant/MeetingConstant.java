package mis.meeting.constant;

public class MeetingConstant {

	public static final String SQL_GET_MEETING_BY_PAN_DATETIME_RANG = 
			"SELECT * FROM MEETING A WHERE (A.MEETING_START_TIME > ? AND A.MEETING_START_TIME < ?) "
			+ " OR (A.MEETING_END_TIME > ? AND A.MEETING_END_TIME < ?)";
	
	public static final String SQL_UPDATE_MEETING_STATE = "UPDATE MEETING A SET A.MEET_STATE_ID = ? WHERE A.MEETING_ID = ?";

	public static final String SQL_DELETE_MEETING_MEMBER_RF = "DELETE FROM MEETING_MEMBER_RF A WHERE A.MEETING_ID = ?";

	public static final String SQL_GET_MEETING_ROOM_BOOKING_LIST_BY_ROOM_ID = "SELECT A.MEETING_ROOM_ID, "
			    + " A.MEETING_ROOM_ADDRESS, B.MEETING_ID, B.MEETING_SUBJECT, B.MEETING_START_TIME, B.MEETING_END_TIME, "
			    + " D.EMPLOYEE_ID, D.EMPLOYEE_NAME, E.DEPARTMENT_ID, E.DEPARTMENT_NAME "
			    + " FROM MEETING_ROOM A, MEETINGB, MEETING_MEMBER_RF C, EMPLOYEE D, DEPARTMENT E, MEETING_MEMBER_ROLE F "
			    + " WHERE A.MEETING_ROOM_ID = B.MEETING_ROOM_ID AND B.MEETING_ID = C.MEETING_ID AND C.EMPLOYEE_ID = D.EMPLOYEE_ID "
			    + " AND D.DEPARTMENT_ID = E.DEPARTMENT_ID AND C.MEETING_MEMBER_ROLE_ID = F.MEETING_MEMBER_ROLE_ID "
			    + " AND A.MEETING_ROOM_ID = ? AND F.MEETING_MEMBER_ROLE_CODE = ? ";

}