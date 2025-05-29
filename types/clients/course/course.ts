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
}

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
}

export type NormalCourseGrade = {
  className: string;
  scoreType: string;
  courseId: string;
  courseName: string;
  studentId: string;
  score: string;
  hundredScore: number;
  evaluationStatus: string;
  studentName: string;
  semesterId: string;
  totalCredits: number;
  schoolName: string;
}