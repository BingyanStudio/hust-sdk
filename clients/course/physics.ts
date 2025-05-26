import type { PhysicsCourseScheduleRaw } from '@/types/clients/course/physics';
import type { AxiosInstance, AxiosResponse } from 'axios';

export async function getCourseSchedule(
  axios: AxiosInstance,
): Promise<AxiosResponse<PhysicsCourseScheduleRaw> | null> {
  const url =
    'http://empxk.hust.edu.cn/weixin/WeChatChooseCourse/getMyCourseSchedule';

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error('CourseClient.physics error on fetching', e);
    return null;
  }
}
