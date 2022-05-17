export class CourseDto {
  constructor(public readonly id: number,
              public readonly course_number: number,
              public readonly institute: number) {
  }

  static fromJSON(json : any) : CourseDto {
    return new CourseDto(
      json.id,
      json.course_number,
      json.institute
    )
  }
}
