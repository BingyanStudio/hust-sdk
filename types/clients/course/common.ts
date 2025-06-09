import type { Dayjs } from "dayjs";

/**
 * 学期信息
 */
export type Semester = {
  /**
   * 学期号
   */
  semesterCode: string;
  /**
   * 学期名称
   */
  semesterName: string;
  /**
   * 起始日期
   */
  startDate: Dayjs;
  /**
   * 结束日期
   */
  endDate: Dayjs;
  /**
   * 季度学期名称
   */
  quarterName: string;
};

export type CourseSchedule = {
  /**
   * 课程名称
   */
  courseName: string;
  /**
   * 课程编号
   */
  courseId?: string;
  /**
   * 老师名称
   */
  teacherName?: string;
  /**
   * 授课教室
   */
  roomName?: string;
  /**
   * 开始节次
   */
  startLesson: number;
  /**
   * 结束节次
   */
  endLesson: number;
  /**
   * 开始时间
   */
  startTime: Dayjs;
  /**
   * 结束时间
   */
  endTime: Dayjs;
  /**
   * 星期几
   */
  weekDay: number;
  /**
   * 周次
   */
  weekNum: number;
};