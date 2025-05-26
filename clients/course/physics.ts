import type {
  PhysicsCourseGrade,
  PhysicsCourseGradesResponse,
  PhysicsCourseSchedule,
  PhysicsCourseScheduleResponse,
} from '@/types/clients/course/physics';
import { renameKeys } from '@/utils/object-utils';
import type { AxiosInstance } from 'axios';
import dayjs from 'dayjs';

export async function getPhysicsCourseSchedule(
  axios: AxiosInstance,
): Promise<PhysicsCourseSchedule[]> {
  const url =
    'http://empxk.hust.edu.cn/weixin/WeChatChooseCourse/getMyCourseSchedule';

  try {
    const response = await axios.get(url);
    const data: PhysicsCourseScheduleResponse = response.data;
    if (response.status !== 200) {
      throw new Error(`Error fetching course schedule.`);
    }
    if (data.state !== '0000') {
      throw new Error(`Error fetching course schedule: ${data.msg}`);
    }
    return data.data
      .filter((item) => !item.isStartElectiveCourse)
      .map(
        (item): PhysicsCourseSchedule => ({
          courseId: item.course_id.toString(),
          courseName: item.course_name,
          teacherName: item.user_name,
          roomName: item.room_name,
          startLesson: item.room_test_num,
          endLesson: item.room_test_num + 1,
          startTime: dayjs(item.start_time),
          endTime: dayjs(item.start_time).add(3, 'hour'),
          weekDay: item.week_day,
          weekNum: item.week_num,
          status: item.status,
          roomTestNum: item.room_test_num,
          sessionName: item.session_name,
        }),
      );
  } catch (e) {
    console.error('CourseClient.physics error on fetching', e);
    throw e;
  }
}

export async function getPhysicsCourseGrades(
  axios: AxiosInstance,
): Promise<PhysicsCourseGrade[]> {
  const url = 'http://empxk.hust.edu.cn/weixin/wechat/searchSumScoreInterface';

  try {
    const response = await axios.get(url);
    const data: PhysicsCourseGradesResponse = response.data;
    if (response.status !== 200) {
      throw new Error(`Error fetching course grades.`);
    }
    if (data.state !== '0000') {
      throw new Error(`Error fetching course grades: ${data.msg}`);
    }
    return data.data.map(
      renameKeys({
        course_name: 'courseName',
        experiment_score: 'experimentScore',
        room_name: 'roomName',
        sign_time: 'signTime',
        user_name: 'userName',
        faculty_id: 'facultyId',
        teacher_id: 'teacherId',
        report_score: 'reportScore',
      } as const),
    ) as PhysicsCourseGrade[];
  } catch (e) {
    console.error('CourseClient.physics error on fetching grades', e);
    throw e;
  }
}
