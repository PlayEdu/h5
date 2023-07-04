declare global {
  interface CourseModel {
    id: number;
    title: string;
    thumb: string;
    short_desc: string;
    is_required: number;
    charge: number;
    class_hour: number;
  }

  interface ChapterModel {
    id: number;
    name: string;
    course_id: number;
    sort: number;
  }

  interface CourseHourModel {
    id: number;
    course_id: number;
    chapter_id: number;
    duration: number;
    rid: number;
    sort: number;
    title: string;
    type: string;
  }

  interface UserLearnRecordModel {
    id: number;
    user_id: number;
    course_id: number;
    hour_count: number;
    finished_at: string;
    finished_count: number;
    is_finished: number;
    progress: number;
    created_at: string;
    updated_at: string;
  }

  interface UserLearnHourRecordModel {
    id: number;
    user_id: number;
    course_id: number;
    hour_id: number;
    is_finished: number;
    finished_duration: number;
    real_duration: number;
    total_duration: number;
    finished_at: string;
    created_at: string;
    updated_at: string;
  }
}

export {};
