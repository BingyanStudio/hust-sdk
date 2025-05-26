import type { CourseSchedule } from './common';

export type PhysicsCourseScheduleResponse = {
  /**
   * 课表数据
   */
  data: {
    /**
     * 课程编号
     */
    course_id: number;
    /**
     * 课程名称
     */
    course_name: string;
    id: number;
    /**
     * 是否在选课时间
     */
    isStartElectiveCourse?: boolean;
    /**
     * 结束状况，未上课 0，已上课 1，其他未知
     */
    isWithdraw: number;
    plan_id: number;
    /**
     * 教室
     */
    room_name: string;
    /**
     * 实验台编号
     */
    room_test_num: number;
    /**
     * 上课时间，上午 / 下午 / 晚上
     */
    session_name: string;
    /**
     * 开始时间
     */
    start_time: string;
    /**
     * 课程状态，正常为 1，其他未知
     */
    status: number;
    /**
     * 老师名称
     */
    user_name: string;
    /**
     * 星期几
     */
    week_day: number;
    /**
     * 周次
     */
    week_num: number;
  }[];
  /**
   * 错误消息，正常返回0
   */
  msg: string;
  /**
   * 状态，正常返回0000
   */
  state: string;
};

export type PhysicsCourseSchedule = CourseSchedule & {
  /**
   * 实验台编号
   */
  roomTestNum: number;
  /**
   * 上课时间，上午 / 下午 / 晚上
   */
  sessionName: string;
  /**
   * 课程状态，正常为 1，其他未知
   */
  status: number;
};

export type PhysicsCourseGradesResponse = {
  /**
   * 成绩数据
   */
  data: {
    /**
     * 校园卡号
     */
    cardNumber: string;
    /**
     * 课程名称
     */
    course_name: string;
    /**
     * 实验成绩
     */
    experiment_score: number;
    faculty_id: number;
    id: number;
    /**
     * 报告成绩
     */
    report_score: number;
    /**
     * 教室
     */
    room_name: string;
    /**
     * 签到时间
     */
    sign_time: string;
    /**
     * 状态，正常为 1
     */
    status: number;
    /**
     * 学号
     */
    studentId: string;
    teacher_id: number;
    /**
     * 学生姓名
     */
    user_name: string;
  }[];
  /**
   * 错误消息，正常为 null
   */
  msg: null | string;
  /**
   * 状态，正常为 0000
   */
  state: string;
};

export type PhysicsCourseGrade = {
  /**
   * 校园卡号
   */
  cardNumber: string;
  /**
   * 课程名称
   */
  courseName: string;
  /**
   * 实验成绩
   */
  experimentScore: number;
  facultyId: number;
  id: number;
  /**
   * 报告成绩
   */
  reportScore: number;
  /**
   * 教室
   */
  roomName: string;
  /**
   * 签到时间
   */
  signTime: string;
  /**
   * 状态，正常为 1
   */
  status: number;
  /**
   * 学号
   */
  studentId: string;
  /**
   * 学生姓名
   */
  userName: string;
};
