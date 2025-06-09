import type { CourseSchedule } from './common';

export type PracticeCourseScheduleResponse = {
  /**
   * 返回码，成功为 S
   */
  returnCode: string;
  /**
   * 返回数据
   */
  returnData: PracticeCourseScheduleResponseItem[];
  /**
   * 错误信息，成功为空
   */
  returnMsg: string;
};

export type PracticeCourseScheduleResponseItem = {
  /**
   * 班级名称
   */
  bjmc: string | null;
  /**
   * 工位名称？
   */
  gwmc: string | null;
  /**
   * 工位序号？
   */
  gwxh: string | null;
  /**
   * 工作编号
   */
  gzbh: string | null;
  /**
   * 工作成绩？
   */
  gzcj: string | null;
  /**
   * 工作名称
   */
  gzmc: string;
  /**
   * 金工实习安排上课计划教室？
   */
  jgsxApskjhJs: string | null;
  /**
   * 计划 ID
   */
  jhid: string | null;  /**
   * 教室编号
   */
  jsbh: string | null;
  /**
   * 结束节次
   */
  jsjc: string;
  /**
   * 教室名称
   */
  jsmc: string;
  /**
   * 结束时间
   */
  jssj: string;
  /**
   * 课程编号
   */
  kcbh: string | null;
  /**
   * 课程名称
   */
  kcmc: string | null;
  /**
   * 课程类型
   */
  kcType: string;
  /**
   * 考试情况名称？
   */
  ksqkmc: string | null;
  /**
   * 开始时间
   */
  kssj: string;
  /**
   * 课堂编号
   */
  ktbh: string | null;
  /**
   * 课堂工作 ID？
   */
  ktgzid: number;
  /**
   * 课堂名称
   */
  ktmc: string | null;
  /**
   * 课堂容量
   */
  ktrl: number | null;
  /**
   * 课堂人数
   */
  ktrs: number | null;  /**
   * 起始节次
   */
  qsjc: string;
  /**
   * 是否有空位
   */
  sfykw: boolean | null;
  /**
   * 上课日期
   */
  skrq: string;
  /**
   * 教师姓名
   */
  teacherName: string;
  /**
   * 时间
   */
  time: string | null;
  /**
   * 训练类型编号
   */
  xllxbh: string | null;
  /**
   * 训练类型名称
   */
  xllxmc: string;
  /**
   * 星期几
   */
  xq: number | null;
  /**
   * 学生人数
   */
  xsrs: number | null;
  /**
   * ？？编号
   */
  zgwbh: string | null;
};

export type PracticeCourseSchedule = CourseSchedule & {
  /**
   * 训练类型名称
   */
  practiceType: string;
  /**
   * 课程类型
   */
  courseType: string;
};
