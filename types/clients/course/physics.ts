export type PhysicsCourseScheduleRaw = {
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
