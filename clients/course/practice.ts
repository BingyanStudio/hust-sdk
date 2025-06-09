import type { Semester } from '@/types/clients/course/common';
import type {
  PracticeCourseSchedule,
  PracticeCourseScheduleResponse,
} from '@/types/clients/course/practice';
import type { AxiosInstance } from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

function getWeekdayFromDate(date: Dayjs): number {
  return date.day() === 0 ? 7 : date.day();
}

async function getSemesterList(axios: AxiosInstance): Promise<Semester[]> {
  const url = 'https://mhub.hust.edu.cn/CommonController/getXqList';

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Error fetching semester list.`);
    }

    return response.data.map((item: any) => ({
      semesterCode: item.XQH,
      semesterName: item.XQMC,
      startDate: dayjs(`${item.QSRQ}T00:00:00.000+08:00`),
      endDate: dayjs(`${item.JSRQ}T23:59:59.999+08:00`),
      quarterName: item.JDXQMC,
    }));
  } catch (e) {
    console.error('Error fetching semester list', e);
    throw e;
  }
}

export async function getPracticeCourseSchedule(
  axios: AxiosInstance,
  {
    start,
    end,
  }: {
    start: string;
    end: string;
  },
): Promise<PracticeCourseSchedule[]> {
  const url = 'http://hub.m.hust.edu.cn/hub_weix/commonController/queryJgsx.do';

  try {
    const semesters = await getSemesterList(axios);

    const response = await axios.post(
      url,
      { jgsxMethod: 'jgsxservice.queryMyTimetableUrl', start, end },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const parsedData = JSON.parse(response.data);

    if (response.status !== 200) {
      throw new Error(`Error fetching practice course schedule.`);
    }
    if (parsedData.returnCode !== 'S') {
      throw new Error(
        `Error fetching practice course schedule: ${parsedData.msg}`,
      );
    }

    const data: PracticeCourseScheduleResponse = {
      ...parsedData,
      returnData: JSON.parse(parsedData.returnData),
    };
    return data.returnData.map((item) => {
      const classDate = dayjs(`${item.skrq}T00:00:00.000+08:00`);
      const startTime = dayjs(`${item.skrq}T${item.kssj}:00.000+08:00`);
      const endTime = dayjs(`${item.skrq}T${item.jssj}:00.000+08:00`);

      const semester = semesters.find(
        (sem) => sem.startDate < classDate && sem.endDate > classDate,
      );

      if (!semester) {
        throw new Error(
          `Class date ${classDate.format('YYYY-MM-DD')} does not fall within any known semester.`,
        );
      }

      const semesterStartDate = semester.startDate;

      const semesterStartMonday =
        semesterStartDate.day() === 1
          ? semesterStartDate
          : semesterStartDate.subtract(
              semesterStartDate.day() === 0 ? 6 : semesterStartDate.day() - 1,
              'day',
            );

      const classDateMonday =
        classDate.day() === 1
          ? classDate
          : classDate.subtract(
              classDate.day() === 0 ? 6 : classDate.day() - 1,
              'day',
            );

      const weekNum = classDateMonday.diff(semesterStartMonday, 'week') + 1;

      return {
        courseName: item.xllxmc,
        teacherName: item.teacherName,
        roomName: item.jsmc,
        startLesson: Number(item.qsjc),
        endLesson: Number(item.jsjc),
        startTime: startTime,
        endTime: endTime,
        weekDay: getWeekdayFromDate(classDate),
        weekNum: weekNum,
        practiceType: item.xllxmc,
        courseType: item.kcType,
      };
    }) as PracticeCourseSchedule[];
  } catch (e) {
    console.error('CourseClient.practice error on fetching grades', e);
    throw e;
  }
}
