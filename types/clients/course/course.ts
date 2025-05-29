import type { CourseSchedule } from './common';

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
};

export type NormalCourseGradesResponseItem = {
  /**
   * 百分成绩
   */
  BFCJ: number;
  /**
   * 班级名称
   */
  BJMC: string;
  /**
   * 成绩类型
   */
  CJLX: string;
  /**
   * ？
   */
  DFFSDM: string;
  /**
   * ？
   */
  HDCJFS: string;
  /**
   * 课程编号
   */
  KCBH: string;
  /**
   * 课程名称
   */
  KCMC: string;
  /**
   * ？
   */
  KGZT: string;
  /**
   * ？
   */
  KSQKZCM: string;
  /**
   * 行编号
   */
  PAGEHELPER_ROW_ID: number;
  /**
   * 行编号
   */
  RANK: number;
  /**
   * 身份 ID？
   */
  SFID: string;
  /**
   * ？
   */
  SFJRJQ: string;
  /**
   * 是否评价
   */
  SFPJ: string;
  /**
   * 学号
   */
  XH: string;
  /**
   * ？
   */
  XKXZDM: string;
  /**
   * 姓名
   */
  XM: string;
  /**
   * 学期
   */
  XQ: string;
  /**
   * 学期号
   */
  XQH: string;
  /**
   * 学生成绩
   */
  XSCJ: string;
  /**
   * 院系名称
   */
  YXSMC: string;
  /**
   * 总学分
   */
  ZXF: number;
};

export type NormalCourseGradesResponse = {
  /**
   * 结束行号
   */
  endRow: number;
  /**
   * 是否有下一页
   */
  hasNextPage: boolean;
  /**
   * 是否有上一页
   */
  hasPreviousPage: boolean;
  /**
   * 是否为第一页
   */
  isFirstPage: boolean;
  /**
   * 是否为最后一页
   */
  isLastPage: boolean;
  list: NormalCourseGradesResponseItem[];
  /**
   * 第一页页码
   */
  navigateFirstPage: number;
  /**
   * 最后一页页码
   */
  navigateLastPage: number;
  /**
   * 可导航页码列表
   */
  navigatepageNums: number[];
  navigatePages: number;
  /**
   * 下一页页码
   */
  nextPage: number;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 总页数
   */
  pages: number;
  /**
   * 单页数据量
   */
  pageSize: number;
  /**
   * 上一页页码
   */
  prePage: number;
  /**
   * 单页数据量
   */
  size: number;
  /**
   * 起始行号
   */
  startRow: number;
  /**
   * 科目门数
   */
  total: number;
};

export type NormalCourseGrade = {
  /**
   * 班级名称
   */
  className: string;
  /**
   * 成绩类型
   */
  scoreType: string;
  /**
   * 课程编号
   */
  courseId: string;
  /**
   * 课程名称
   */
  courseName: string;
  /**
   * 学号
   */
  studentId: string;
  /**
   * 学生成绩
   */
  score: string;
  /**
   * 百分成绩
   */
  hundredScore: number;
  /**
   * 是否评价
   */
  evaluationStatus: string;
  /**
   * 姓名
   */
  studentName: string;
  /**
   * 学期号
   */
  semesterId: string;
  /**
   * 总学分
   */
  totalCredits: number;
  /**
   * 院系名称
   */
  schoolName: string;
};

export enum ExaminationType {
  NORMAL = '1',
  RETAKE = '0',
}

export type ExaminationArrangementsResponseItem = {
  /**
   * 单位名称，一般为开课学院
   */
  DWMC: string;
  /**
   * 教室名称，考试地点，null为暂未安排
   */
  JSMC: null | string;
  /**
   * 课程编号
   */
  KCBH: string;
  /**
   * 课程名称
   */
  KCMC: string;
  /**
   * 考试类型，0为补缓考，1为普通考试
   */
  KSLX: string;
  /**
   * 考试日期
   */
  KSRQ: string;
  /**
   * 课堂编号
   */
  KTBH: string;
  /**
   * 排课单位？
   */
  PKDW: string;
  SCHEDULEID: string;
  /**
   * 身份编号，一般为学号
   */
  SFID: string;
  /**
   * 学生姓名
   */
  XM: string;
  /**
   * 学期号
   */
  XQH: string;
  /**
   * 学期名称
   */
  XQMC: string;
  /**
   * 最后授课周次
   */
  ZHSKZC: number;
};

export type ExaminationArrangementsResponse = {
  endRow: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  list: ExaminationArrangementsResponseItem[];
  navigateFirstPage: number;
  navigateLastPage: number;
  navigatepageNums: number[];
  navigatePages: number;
  nextPage: number;
  pageNum: number;
  pages: number;
  pageSize: number;
  prePage: number;
  size: number;
  startRow: number;
  total: number;
};

export type ExaminationArrangement = {
  scheduleId: string;
  /**
   * 单位名称，一般为开课学院
   */
  departmentName: string;
  /**
   * 排课单位？
   */
  departmentId: string;
  /**
   * 教室名称，考试地点，null为暂未安排
   */
  classroomName: string | null;
  /**
   * 课程编号
   */
  courseId: string;
  /**
   * 课程名称
   */
  courseName: string;
  /**
   * 考试类型，0为补缓考，1为普通考试
   */
  examType: ExaminationType;
  /**
   * 考试日期
   */
  examDate: string;
  /**
   * 课堂编号
   */
  classId: string;
  /**
   * 身份编号，一般为学号
   */
  studentId: string;
  /**
   * 学生姓名
   */
  studentName: string;
  /**
   * 学期号
   */
  semesterId: string;
  /**
   * 学期名称
   */
  semesterName: string;
  /**
   * 最后授课周次
   */
  lastTeachingWeek: number;
}