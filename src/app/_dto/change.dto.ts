import {LessonDto} from "./lesson.dto";
import {TeacherDto} from "./teacher.dto";
import {Time} from "@angular/common";

export class ChangeDto {
  public readonly time_change_end: Time | null
  public readonly time_change_start: Time | null
  constructor(public readonly comment: string | null,
              public readonly day_change: number | null,
              public readonly end_date: Date,
              public readonly format_change: number,
              public readonly id: number,
              public readonly lesson: LessonDto,
              public readonly start_date: Date,
              public readonly teacher_change: TeacherDto | null,
              time_change_end: string | null,
              time_change_start: string | null,
              public readonly type: number) {
    this.time_change_end = time_change_end ? {
      hours: +time_change_end.substring(0, 2),
      minutes: +time_change_end.substring(3, 5)
    } : null
    this.time_change_start = time_change_start ? {
      hours: +time_change_start.substring(0, 2),
      minutes: +time_change_start.substring(3, 5)
    } : null
  }

  static fromJSON(json: any, lessons: Map<number, LessonDto>, teachers: Map<number, TeacherDto>): ChangeDto {
    return new ChangeDto(
      json.comment,
      json.day_change,
      new Date(json.end_date),
      json.format_change,
      json.id,
      lessons.get(json.lesson)!,
      new Date(json.start_date),
      teachers.get(json.teacher_change) || null,
      json.time_change_end,
      json.time_change_start,
      json.type
    )
  }
}
