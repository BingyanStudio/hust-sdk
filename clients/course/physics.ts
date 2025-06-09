import type {
  PhysicsCourseGrade,
  PhysicsCourseGradesResponse,
  PhysicsCourseSchedule,
  PhysicsCourseScheduleResponse,
} from '@/types/clients/course/physics';
import type { AxiosInstance } from 'axios';
import dayjs from 'dayjs';

function getStartLessonFromSessionName(sessionName: string): number {
  switch (sessionName) {
    case '上午':
      return 1;
    case '下午':
      return 5;
    case '晚上':
      return 9;
    default:
      return -1;
  }
}

function getEndLessonFromSessionName(sessionName: string): number {
  switch (sessionName) {
    case '上午':
      return 4;
    case '下午':
      return 8;
    case '晚上':
      return 12;
    default:
      return -1;
  }
}

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
          startLesson: getStartLessonFromSessionName(item.session_name),
          endLesson: getEndLessonFromSessionName(item.session_name),
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
      (item) => ({
        cardNumber: item.cardNumber,
        courseName: item.course_name,
        experimentScore: item.experiment_score,
        id: item.id,
        roomName: item.room_name,
        signTime: item.sign_time,
        userName: item.user_name,
        facultyId: item.faculty_id,
        teacherId: item.teacher_id,
        reportScore: item.report_score,
        status: item.status,
        studentId: item.studentId,
      }),
    ) as PhysicsCourseGrade[];
  } catch (e) {
    console.error('CourseClient.physics error on fetching grades', e);
    throw e;
  }
}
