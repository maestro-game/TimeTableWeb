import {CourseDto} from "./course.dto";

export class BlockDto {
  constructor(public readonly id: number,
              public readonly name: string,
              public readonly course: CourseDto | null) {
  }

  static fromJSON(json : any, courses: Map<number, CourseDto>) : BlockDto {
    return new BlockDto(
      json.id,
      json.name || "",
      courses.get(json.course) || null
    )
  }
}
