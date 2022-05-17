import {Time} from "@angular/common";
import {GroupDto} from "./group.dto";
import {SubjectDto} from "./subject.dto";
import {TeacherDto} from "./teacher.dto";
import {Helper, IndexName} from "../_helper/helper";
import {ChangeDto} from "./change.dto";

export class LessonDto {
  public start_time: Time
  public end_time: Time
  public readonly changes: ChangeDto[]
  public static readonly typeNames: IndexName[] = [
    {id: 1, name: "Практика (онлайн)"},
    {id: 2, name: "Практика"},
    {id: 3, name: "Лекция (онлайн)"},
    {id: 4, name: "Лекция"}]
  public static readonly parityName: IndexName[] = [
    {id: 1, name: "нечет. н."},
    {id: 2, name: "четная н."},
    {id: 3, name: "каждую н."}
  ]

  constructor(public classroom: string | null,
              public day_name: number,
              start_time: string,
              end_time: string,
              public group: GroupDto,
              public readonly id: number,
              public is_even_week: number,
              public links: string[],
              public subject: SubjectDto,
              public teacher: TeacherDto,
              public type: number) {
    this.start_time = {
      hours: +start_time.substring(0, 2),
      minutes: +start_time.substring(3, 5)
    }
    this.end_time = {
      hours: +end_time.substring(0, 2),
      minutes: +end_time.substring(3, 5)
    }
    this.changes = []
  }

  public getTypeName() {
    return LessonDto.typeNames[this.type - 1].name
  }

  public getEvenName() {
    return LessonDto.parityName[this.is_even_week - 1].name
  }

  static fromJSON(json: any, groups: Map<number, GroupDto>, subjects: Map<number, SubjectDto>, teachers: Map<number, TeacherDto>): LessonDto {
    return new LessonDto(
      json.classroom,
      json.day_name,
      json.start_time,
      json.end_time,
      groups.get(json.group)!,
      json.id,
      json.is_even_week,
      json.links,
      subjects.get(json.subject)!,
      teachers.get(json.teacher)!,
      json.type
    )
  }

  toJson() {
    return {
      id: this.id,
      day_name: this.day_name,
      start_time: Helper.toBackEndString(this.start_time),
      end_time: Helper.toBackEndString(this.end_time),
      type: this.type,
      is_even_week: this.is_even_week,
      teacher: this.teacher.id,
      subject: this.subject.id,
      classroom: this.classroom,
      group: this.group.id,
      links: this.links
    }
  }
}
