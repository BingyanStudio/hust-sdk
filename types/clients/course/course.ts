import type { CourseSchedule } from "./common";

export type NormalCourseScheduleResponseClass = {
  /**
   * 备注
   */
  BZ: string;
  /**
   * 节次
   */
  JC: string;
  /**
   * 结束节次
   */
  JSJC: string;
  /**
   * 教室名称
   */
  JSMC: string;
  /**
   * 结束周次
   */
  JSZC: number;
  /**
   * 课程编号
   */
  KCBH: string;
  /**
   * 课程名称
   */
  KCMC: string;
  /**
   * 课堂编号
   */
  KTBH: string;
  /**
   * 课堂名称
   */
  KTMC: string;
  /**
   * 面向年级
   */
  MXNJ: string;
  /**
   * 起始节次
   */
  QSJC: string;
  /**
   * 起始周次
   */
  QSZC: number;
  /**
   * 授课形式
   */
  SKXS: string;
  /**
   * 星期几
   */
  XQ: string;
  /**
   * 学期号
   */
  XQH: string;
};

export type NormalCourseScheduleResponse = {
  /**
   * 周次
   */
  ZC: number;
  /**
   * 结束时间
   */
  JS: string;
  /**
   * 开始时间
   */
  KS: string;
  /**
   * 周一
   */
  MONDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周二
   */
  TUESDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周三
   */
  WEDNESDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周四
   */
  THURSDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周五
   */
  FRIDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周六
   */
  SATURDAY: NormalCourseScheduleResponseClass[];
  /**
   * 周日
   */
  SUNDAY: NormalCourseScheduleResponseClass[];
}[];

export type NormalCourseSchedule = CourseSchedule & {
  /**
   * 备注
   */
  remarks: string;
  /**
   * 课堂编号
   */
  classId: string;
  /**
   * 课堂名称
   */
  className: string;
  /**
   * 面向年级
   */
  targetGrade: string;
  /**
   * 起始周次
   */
  startWeek: number;
  /**
   * 结束周次
   */
  endWeek: number;
  /**
   * 授课形式
   */
  teachingMethod: string;
  /**
   * 学期号
   */
  semesterId: string;
}