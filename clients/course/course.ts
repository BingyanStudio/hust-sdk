import type {
  NormalCourseGrade,
  NormalCourseGradesResponse,
  NormalCourseSchedule,
  NormalCourseScheduleResponse,
} from '@/types/clients/course/course';
import type { AxiosInstance } from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

function getStartTimeFromLesson(lesson: number, date: Dayjs): Dayjs {
  const mayDay = date
    .clone()
    .set('month', 5)
    .set('day', 1)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0);
  const nationalDay = date
    .clone()
    .set('month', 10)
    .set('day', 1)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0);

  if (date >= mayDay && date < nationalDay) {
    switch (lesson) {
      case 1:
        return date.hour(8).minute(0);
      case 2:
        return date.hour(8).minute(55);
      case 3:
        return date.hour(10).minute(10);
      case 4:
        return date.hour(11).minute(5);
      case 5:
        return date.hour(14).minute(0);
      case 6:
        return date.hour(14).minute(50);
      case 7:
        return date.hour(15).minute(55);
      case 8:
        return date.hour(16).minute(45);
      case 9:
        return date.hour(18).minute(30);
      case 10:
        return date.hour(19).minute(20);
      case 11:
        return date.hour(20).minute(15);
      case 12:
        return date.hour(21).minute(5);
      default:
        throw new Error(`Invalid lesson number: ${lesson}`);
    }
  } else {
    switch (lesson) {
      case 1:
        return date.hour(8).minute(0);
      case 2:
        return date.hour(8).minute(55);
      case 3:
        return date.hour(10).minute(10);
      case 4:
        return date.hour(11).minute(5);
      case 5:
        return date.hour(14).minute(30);
      case 6:
        return date.hour(15).minute(20);
      case 7:
        return date.hour(16).minute(25);
      case 8:
        return date.hour(17).minute(15);
      case 9:
        return date.hour(19).minute(0);
      case 10:
        return date.hour(19).minute(50);
      case 11:
        return date.hour(20).minute(45);
      case 12:
        return date.hour(21).minute(35);
      default:
        throw new Error(`Invalid lesson number: ${lesson}`);
    }
  }
}

function getEndTimeFromLesson(lesson: number, date: Dayjs): Dayjs {
  const startTime = getStartTimeFromLesson(lesson, date);
  return startTime.add(45, 'minute');
}

export async function getNormalCourseSchedule(
  axios: AxiosInstance,
  semesterId: string,
): Promise<NormalCourseSchedule[]> {
  const url = `https://hubs.hust.edu.cn/schedule/getStudentScheduleByXqh?XQH=${semesterId}`;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(
        `Error fetching course schedule for semester ${semesterId}.`,
      );
    }
    const data: NormalCourseScheduleResponse = response.data;

    const results: NormalCourseSchedule[] = [];
    for (const item of data) {
      const startTime = dayjs(item.KS);
      const weekdays = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ] as const;
      for (const index in weekdays) {
        const dayKey = weekdays[index]!;
        const classes = item[dayKey];
        if (classes && classes.length > 0) {
          results.push(
            ...classes.map((cls) => ({
              courseId: cls.KCBH,
              courseName: cls.KCMC,
              teacherName: cls.JSMC,
              roomName: cls.JSMC,
              startLesson: Number(cls.QSJC),
              endLesson: Number(cls.JSJC),
              startTime: getStartTimeFromLesson(
                Number(cls.QSJC),
                startTime.add(Number(index), 'day'),
              ),
              endTime: getEndTimeFromLesson(
                Number(cls.JSJC),
                startTime.add(Number(index), 'day'),
              ),
              weekDay: Number(cls.XQ),
              weekNum: item.ZC,
              classId: cls.KTBH,
              className: cls.KTMC,
              remarks: cls.BZ || '',
              targetGrade: cls.MXNJ,
              startWeek: cls.QSZC,
              endWeek: cls.JSZC,
              teachingMethod: cls.SKXS,
              semesterId: cls.XQH,
            })),
          );
        }
      }
    }

    return results;
  } catch (e) {
    console.error('CourseClient.getNormalCourseSchedule error on fetching', e);
    throw e;
  }
}

export async function getNormalCourseGrades(
  axios: AxiosInstance,
  semesterId: string,
  pageNumber: number = 1,
  pageSize: number = 20,
): Promise<NormalCourseGrade[]> {
  const params = new URLSearchParams();
  params.append('XQH', semesterId);
  params.append('pageNum', String(pageNumber));
  params.append('pageSize', String(pageSize));
  const url = `https://hubs.hust.edu.cn/student/gradeSelect/queryResults?${params.toString()}`;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(
        `Error fetching course grades for semester ${semesterId}.`,
      );
    }
    const data: NormalCourseGradesResponse = response.data;

    return data.list.map((item) => ({
      className: item.BJMC,
      scoreType: item.CJLX,
      courseId: item.KCBH,
      courseName: item.KCMC,
      studentId: item.XH,
      score: item.XSCJ,
      hundredScore: item.BFCJ,
      evaluationStatus: item.SFPJ,
      studentName: item.XM,
      semesterId: item.XQH,
      totalCredits: item.ZXF,
      schoolName: item.YXSMC,
    }));
  } catch (e) {
    console.error('CourseClient.getNormalCourseGrades error on fetching', e);
    throw e;
  }
}
