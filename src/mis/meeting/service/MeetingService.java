package mis.meeting.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import mis.meeting.dao.MeetingDAO;
import mis.meeting.dto.MeetingDTO;
import mis.meeting.dto.MeetingMemberRfDTO;
import mis.meeting.dto.MeetingRoomBookingDTO;
import mis.meeting.dto.MeetingRoomDTO;
import mis.meeting.entity.MeetingAttachmentEntity;
import mis.meeting.entity.MeetingEntity;
import mis.meeting.entity.MeetingMemberRfEntity;
import mis.meeting.entity.MeetingRoomEntity;
import mis.meeting.myenum.AttachmentCategoryEnum;
import mis.meeting.myenum.MeetingMemberRoleEnum;
import mis.meeting.myenum.MeetingStateEnum;
import mis.shortmessage.entity.MessageSendCenterEntity;
import mis.shortmessage.myenum.MessageSendStateEnum;

import org.aspectj.util.FileUtil;
import org.springframework.stereotype.Service;

import ecp.bsp.system.commons.constant.ExceptionCodeConst;
import ecp.bsp.system.commons.dto.ActionResult;
import ecp.bsp.system.commons.utils.ActionResultUtil;
import ecp.bsp.system.commons.utils.LoggerUtil;
import ecp.bsp.system.commons.utils.StringUtils;
import ecp.bsp.system.core.BaseDTO;
import ecp.bsp.system.core.BaseService;
import ecp.bsp.system.framework.file.data.entity.AttachmentEntity;
import ecp.bsp.system.framework.file.data.entity.AttachmentTempEntity;
import ecp.bsp.system.framework.file.impl.AttachmentDAO;

@Service
public class MeetingService extends BaseService {
	@Resource
	private MeetingDAO meetingDAO;
	
	@Resource
	private AttachmentDAO attachmentDAO;
	
	public ActionResult isMeetingExistByPlanDatetimeRang(MeetingDTO inMeetingDTO) {
		MeetingEntity tmpMeetingEntity = this.meetingDAO.getMeetingByPlanDatetimeRang(inMeetingDTO.getMeetingRoomId(), 
				inMeetingDTO.getMeetingStartTime(), inMeetingDTO.getMeetingEndTime());
		if (tmpMeetingEntity != null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "会议时间冲突" + "\n\r" 
				    + "在当前发起会议的开始时间和结束时间段内已经有其它会议占用了会议室" + "\n\r"
					+ "发生冲突的会议：" + tmpMeetingEntity.getMeetingSubject();
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
		
		return ActionResultUtil.getActionResult(inMeetingDTO.getMeetingRoomId(), "不存在时间冲突的会议");
	}
	
	public ActionResult insertMeeting(MeetingDTO inMeetingDTO) throws Exception {
		// 会议时间重复时需要询问用户是否确认发起会议，这部分功能不在本方法中实现，所有本方法不需要检测会议时间是否重叠问题
        MeetingEntity tmpNewMeetingEntity = new MeetingEntity();
        MeetingDTO.dtoToEntity(inMeetingDTO, tmpNewMeetingEntity);
        tmpNewMeetingEntity.setMeetingStateId(String.valueOf(MeetingStateEnum.MEETING_OPEN.ordinal()));
		this.meetingDAO.insert(tmpNewMeetingEntity);
		
		// 设置会议ID信息
		inMeetingDTO.setMeetingId(tmpNewMeetingEntity.getMeetingId());
		
		// 插入与会人员信息
		MeetingMemberRfEntity tmpMeetingMemberRfEntity = null;
		List<MeetingMemberRfDTO> tmpMeetingMemberList = this.getMeetingMemberList(inMeetingDTO);
		for(MeetingMemberRfDTO tmpSubMeetingMember: tmpMeetingMemberList) {
			tmpMeetingMemberRfEntity = new MeetingMemberRfEntity();
			MeetingMemberRfDTO.dtoToEntity(tmpSubMeetingMember, tmpMeetingMemberRfEntity);
			this.meetingDAO.insert(tmpMeetingMemberRfEntity);
		}
		
		// 插入会议附件信息
		this.saveMeetingFile(inMeetingDTO);
		
		// 插入短信通知信息
		this.saveMessageSendInfo(inMeetingDTO);
		
		return ActionResultUtil.getActionResult(tmpNewMeetingEntity.getId(), "会议发起成功");
	}
	
	public ActionResult updateMeeting(MeetingDTO inMeetingDTO) throws Exception {
        MeetingEntity tmpCurrentMeetingEntity = this.meetingDAO.getEntity(MeetingEntity.class, "meetingId", inMeetingDTO.getMeetingId());
		if (tmpCurrentMeetingEntity == null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "没有会议可更新";
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
		
		// 清空与会人员信息
		this.meetingDAO.deleteMeetingMember(tmpCurrentMeetingEntity.getMeetingId());
			
		// 更新会议信息
		MeetingDTO.dtoToEntity(inMeetingDTO, tmpCurrentMeetingEntity);
		this.meetingDAO.update(tmpCurrentMeetingEntity);
		
		// 插入与会人员信息
		MeetingMemberRfEntity tmpMeetingMemberRfEntity = null;
		List<MeetingMemberRfDTO> tmpMeetingMemberList = this.getMeetingMemberList(inMeetingDTO);
		for(MeetingMemberRfDTO tmpSubMeetingMember: tmpMeetingMemberList) {
			tmpMeetingMemberRfEntity = new MeetingMemberRfEntity();
			MeetingMemberRfDTO.dtoToEntity(tmpSubMeetingMember, tmpMeetingMemberRfEntity);
			tmpMeetingMemberRfEntity.setMeetingId(tmpCurrentMeetingEntity.getMeetingId());
			this.meetingDAO.insert(tmpMeetingMemberRfEntity);
		}
			
		// 插入会议附件
		
		return ActionResultUtil.getActionResult(tmpCurrentMeetingEntity.getId(), "会议更新成功");
	}
	
	public ActionResult deleteMeeting(String inMeetingId) throws Exception {
		MeetingEntity tmpMeetingEntity = this.meetingDAO.getEntity(MeetingEntity.class, "meetingId", inMeetingId);
		if (tmpMeetingEntity == null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "没有会议可删除";
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
		
		// 清空与会人员信息
		this.meetingDAO.deleteMeetingMember(tmpMeetingEntity.getMeetingId());
		// 删除会议信息
		this.meetingDAO.delete(tmpMeetingEntity);
		
		return ActionResultUtil.getActionResult(tmpMeetingEntity.getId(), "会议删除成功");
	}
	
	public ActionResult closeMeeting(String inMeetingId) throws Exception {
		MeetingEntity tmpMeetingEntity = this.meetingDAO.getEntity(MeetingEntity.class, "meetingId", inMeetingId);
		if (tmpMeetingEntity == null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "没有找到对应的会议，会议ID：" + inMeetingId;
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
		
		this.meetingDAO.CloseMeeting(inMeetingId);
		
		return ActionResultUtil.getActionResult(tmpMeetingEntity.getId(), "会议关闭成功");
	}
	
	private List<MeetingMemberRfDTO> getMeetingMemberList(MeetingDTO inMeetingDTO) {
		List<MeetingMemberRfDTO> tmpMeetingMemberRfDTOList = new ArrayList<MeetingMemberRfDTO>();
		MeetingMemberRfDTO tmpMeetingMemberRfDTO = null;
		if (StringUtils.isValidateString(inMeetingDTO.getMeetingCreator())) {
			tmpMeetingMemberRfDTO = new MeetingMemberRfDTO();
			tmpMeetingMemberRfDTO.setEmployeeId(inMeetingDTO.getMeetingCreator());
			tmpMeetingMemberRfDTO.setMeetingId(inMeetingDTO.getMeetingId());
			tmpMeetingMemberRfDTO.setMeetingMemberRoleId(String.valueOf(MeetingMemberRoleEnum.MEETING_CREATOR.ordinal()));
			tmpMeetingMemberRfDTOList.add(tmpMeetingMemberRfDTO);
		}
		if (StringUtils.isValidateString(inMeetingDTO.getMeetingPresenter())) {
			tmpMeetingMemberRfDTO = new MeetingMemberRfDTO();
			tmpMeetingMemberRfDTO.setEmployeeId(inMeetingDTO.getMeetingPresenter());
			tmpMeetingMemberRfDTO.setMeetingId(inMeetingDTO.getMeetingId());
			tmpMeetingMemberRfDTO.setMeetingMemberRoleId(String.valueOf(MeetingMemberRoleEnum.MEETING_PRESENTER.ordinal()));
			tmpMeetingMemberRfDTOList.add(tmpMeetingMemberRfDTO);
		}
		if (StringUtils.isValidateString(inMeetingDTO.getMeetingParticipants())) {
			String[] tmpMeetingParticipantArray = inMeetingDTO.getMeetingParticipants().split(",");
			for (String subMeetingParticipant : tmpMeetingParticipantArray) {
				tmpMeetingMemberRfDTO = new MeetingMemberRfDTO();
				tmpMeetingMemberRfDTO.setEmployeeId(subMeetingParticipant);
				tmpMeetingMemberRfDTO.setMeetingId(inMeetingDTO.getMeetingId());
				tmpMeetingMemberRfDTO.setMeetingMemberRoleId(String.valueOf(MeetingMemberRoleEnum.MEETING_PARTICIPANT.ordinal()));
				tmpMeetingMemberRfDTOList.add(tmpMeetingMemberRfDTO);
			}
		}
		
		return tmpMeetingMemberRfDTOList;
	}
	
	public void saveMeetingFile(MeetingDTO inMeetingDTO) throws Exception {
		List<AttachmentEntity> tmpSaveMeetingAttachmentEntityList = new ArrayList<AttachmentEntity>();
		// 保存会议记录附件信息		
		this.saveAttachment(inMeetingDTO.getMeetingRecordFileList(), inMeetingDTO.getMeetingId(), 
				AttachmentCategoryEnum.MEETING_RECORD_ATTACHMENT, tmpSaveMeetingAttachmentEntityList);
		// 保存普通附件信息		
		this.saveAttachment(inMeetingDTO.getMeetingFileList(), inMeetingDTO.getMeetingId(), 
				AttachmentCategoryEnum.NORMAL_ATTACHMENT, tmpSaveMeetingAttachmentEntityList);
		// 保存文件物理信息
		for(AttachmentEntity subAttachmentEntity : tmpSaveMeetingAttachmentEntityList){
			String tmpSourceFileName = subAttachmentEntity.getAttachmentTempPath() + File.separator + subAttachmentEntity.getAttachmentCreateId();
			String tmpTargeFileName = subAttachmentEntity.getAttachmentPath() + File.separator + subAttachmentEntity.getAttachmentName();
			FileUtil.copyFile(new File(tmpSourceFileName), new File(tmpTargeFileName));
		}
	}
	
	public void saveAttachment(List<String> inAttachmentList, String inMeetingId, AttachmentCategoryEnum inAttachmentCategoryEnum,
			List<AttachmentEntity> outSaveMeetingAttachmentEntityList) throws Exception {
		AttachmentEntity tmpAttachmentEntity = null;
		MeetingAttachmentEntity tmpMeetingAttachmentEntity = null;
		for (String subAttachmentId : inAttachmentList) {
			AttachmentTempEntity tmpAttachmentTempEntity = this.attachmentDAO.getEntity(AttachmentTempEntity.class, subAttachmentId);
			// 保存附件信息
			tmpAttachmentEntity = new AttachmentEntity();    
			BaseDTO.copyObjectPropertys(tmpAttachmentTempEntity, tmpAttachmentEntity);
			tmpAttachmentEntity.setAttachmentRename(tmpAttachmentTempEntity.getAttachmentCreateId());
			this.attachmentDAO.insert(tmpAttachmentEntity);
			outSaveMeetingAttachmentEntityList.add(tmpAttachmentEntity);
			
			// 保存附件信息
			tmpMeetingAttachmentEntity = new MeetingAttachmentEntity();
			tmpMeetingAttachmentEntity.setAttachmentId(tmpAttachmentEntity.getAttachmentId());
			tmpMeetingAttachmentEntity.setMeetingId(inMeetingId);
			tmpMeetingAttachmentEntity.setAttachmentCategoryId(String.valueOf(inAttachmentCategoryEnum.ordinal()));
			this.attachmentDAO.insert(tmpMeetingAttachmentEntity);
		}
	}
	
	public void saveMessageSendInfo(MeetingDTO inMeetingDTO) throws Exception {
		if (inMeetingDTO.getMessageNoticeTime() != null) {
			MessageSendCenterEntity tmpMessageSendCenterEntity = new MessageSendCenterEntity();
			tmpMessageSendCenterEntity.setMeetingId(inMeetingDTO.getMeetingId());
			tmpMessageSendCenterEntity.setSendMessage(inMeetingDTO.getMeetingSubject());
			tmpMessageSendCenterEntity.setSendDatetime(inMeetingDTO.getMessageNoticeTime());
			tmpMessageSendCenterEntity.setMessageSendStateId(String.valueOf(MessageSendStateEnum.UNSEND.ordinal()));
			this.meetingDAO.insert(tmpMessageSendCenterEntity);
		}
	}
	
	/**
	 * 根据会议ID获取会议信息
	 * 
	 * @param inMeetingId
	 *     会议ID
	 * @return
	 *     返回会议信息
	 * @throws Exception 
	 */
	public MeetingDTO getMeetingInfoById(String inMeetingId) throws Exception {
		return this.meetingDAO.getMeetingInfoById(inMeetingId);
	}
	
	public ActionResult insertMeetingRoom(MeetingRoomDTO inMeetingRoomDTO) throws Exception {
		MeetingRoomEntity tmpExistMeetingRoomEntity = this.meetingDAO.getEntity(MeetingRoomEntity.class, "meetingRoomName", inMeetingRoomDTO.getMeetingRoomName());
        if (tmpExistMeetingRoomEntity != null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "当前新建的会议室地址与其它会议室地址相同，发生冲突";
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
        
        MeetingRoomEntity tmpNewMeetingRoomEntity = new MeetingRoomEntity();
        MeetingRoomDTO.dtoToEntity(inMeetingRoomDTO, tmpNewMeetingRoomEntity);
		this.meetingDAO.insert(tmpNewMeetingRoomEntity);
		
		return ActionResultUtil.getActionResult(tmpNewMeetingRoomEntity.getId(), "会议室新建成功");
	}
	
	public ActionResult updateMeetingRoom(MeetingRoomDTO inMeetingRoomDTO) throws Exception {
		MeetingRoomEntity tmpExistMeetingRoomEntity = this.meetingDAO.getEntity(MeetingRoomEntity.class, "meetingRoomName", inMeetingRoomDTO.getMeetingRoomName());
        if (tmpExistMeetingRoomEntity != null) {
        	if (!tmpExistMeetingRoomEntity.getId().equals(inMeetingRoomDTO.getMeetingRoomId()) && tmpExistMeetingRoomEntity.getMeetingRoomName().equals(inMeetingRoomDTO.getMeetingRoomName())) {
    			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "当前修改的会议室名称与其它会议室名称相同，发生冲突";
    			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
    			throw new RuntimeException(exceptionMessage);
    		}
        }
		
        MeetingRoomEntity tmpCurrentMeetingRoomEntity = this.meetingDAO.getEntity(MeetingRoomEntity.class, "meetingRoomId", inMeetingRoomDTO.getMeetingRoomId());
		if (tmpCurrentMeetingRoomEntity == null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "没有会议室可修改";
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}

		MeetingRoomDTO.dtoToEntity(inMeetingRoomDTO, tmpCurrentMeetingRoomEntity);
		this.meetingDAO.update(tmpCurrentMeetingRoomEntity);
		
		return ActionResultUtil.getActionResult(tmpCurrentMeetingRoomEntity.getId(), "会议室修改成功");
	}
	
	public ActionResult deleteMeetingRoom(String inMeetingRoomId) throws Exception {
		MeetingRoomEntity tmpMeetingRoomEntity = this.meetingDAO.getEntity(MeetingRoomEntity.class, "meetingRoomId", inMeetingRoomId);
		if (tmpMeetingRoomEntity == null) {
			String exceptionMessage = ExceptionCodeConst.SYSTEM_EXCEPTION_CODE + "没有会议室可删除";
			LoggerUtil.instance(this.getClass()).error(exceptionMessage);
			throw new RuntimeException(exceptionMessage);
		}
		
		this.meetingDAO.delete(tmpMeetingRoomEntity);
		
		return ActionResultUtil.getActionResult(tmpMeetingRoomEntity.getId(), "会议室删除成功");
	}
	
	/**
	 * 获取会议室信息列表
	 * 
	 * @return
	 *     返回会议室信息列表
	 * @throws Exception 
	 */
	public Object getMeetingRoomList() throws Exception {
		return (List<MeetingRoomDTO>) this.meetingDAO.getMeetingRoomList();
	}
	
	public List<MeetingRoomBookingDTO> getMeetingRoomBookingListByRoomId(String inMeetingRoomId) {
		return (List<MeetingRoomBookingDTO>) this.meetingDAO.getMeetingRoomBookingListByRoomId(inMeetingRoomId);
	}
}
