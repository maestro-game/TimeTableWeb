import {BlockDto} from "./block.dto";
import {CourseDto} from "./course.dto";
import {GroupDto} from "./group.dto";
import {ChangeDto} from "./change.dto";
import {LessonDto} from "./lesson.dto";
import {SubjectDto} from "./subject.dto";
import {TeacherDto} from "./teacher.dto";

export class DataDto {
  constructor(public readonly blocks: BlockDto[],
              public readonly changes: ChangeDto[],
              public readonly courses: CourseDto[],
              public readonly groups: GroupDto[],
              public readonly lessons: LessonDto[],
              public readonly subjects: SubjectDto[],
              public readonly teachers: TeacherDto[]) {
  }

  static fromJSON(json: any): DataDto {
    let teachers: Map<number, TeacherDto> = new Map(json.teachers.map((value: any) => {
      let obj = TeacherDto.fromJSON(value);
      return [obj.id, obj];
    }))
    let courses: Map<number, CourseDto> = new Map(json.courses.map((value: any) => {
      let obj = CourseDto.fromJSON(value);
      return [obj.id, obj];
    }))
    let blocks: Map<number, BlockDto> = new Map(json.blocks.map((value: any) => {
      let obj = BlockDto.fromJSON(value, courses);
      return [obj.id, obj];
    }))
    let subjects: Map<number, SubjectDto> = new Map(json.subjects.map((value: any) => {
      let obj = SubjectDto.fromJSON(value, blocks);
      return [obj.id, obj];
    }))
    let groups: Map<number, GroupDto> = new Map(json.groups.map((value: any) => {
      let obj = GroupDto.fromJSON(value, courses);
      return [obj.id, obj];
    }))
    let lessons: Map<number, LessonDto> = new Map(json.lessons.map((value: any) => {
      let obj = LessonDto.fromJSON(value, groups, subjects, teachers);
      return [obj.id, obj];
    }))
    let changes: ChangeDto[] = json.changes.map((value: any) => {
      let obj = ChangeDto.fromJSON(value, lessons, teachers);
      obj.lesson.changes.push(obj)
      return obj
    })
    return new DataDto(
      Array.from(blocks.values()).sort((a, b) => (a.name > b.name) ? 1 : -1),
      Array.from(changes.values()).sort(a => a.id),
      Array.from(courses.values()).sort(a => a.course_number),
      Array.from(groups.values()).sort((a, b) => (a.group_number > b.group_number) ? 1 : -1),
      Array.from(lessons.values()).sort(a => a.id),
      Array.from(subjects.values()).sort((a, b) => (a.name > b.name) ? 1 : -1),
      Array.from(teachers.values()).sort((a, b) => (a.name > b.name) ? 1 : -1))
  }
}
