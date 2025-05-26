import type { Dayjs } from "dayjs";

export type CourseSchedule = {
  /**
   * 课程名称
   */
  courseName: string;
  /**
   * 课程编号
   */
  courseId: string;
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