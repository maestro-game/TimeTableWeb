import {CourseDto} from "./course.dto";

export class GroupDto {
  constructor(public readonly id: number,
              public readonly group_number: string,
              public readonly course: CourseDto) {
  }

  static fromJSON(json: any, courses: Map<number, CourseDto>) : GroupDto {
    return new GroupDto(
      json.id,
      json.group_number,
      courses.get(json.course)!
    )
  }
}
