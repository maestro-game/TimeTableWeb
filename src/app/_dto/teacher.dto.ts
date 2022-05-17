export class TeacherDto {
  constructor(public readonly id: number,
              public readonly name: string,
              public readonly profile_link: string | null,
              public readonly not_work_from: Date | null) {
  }

  static fromJSON(json : any) : TeacherDto {
    return new TeacherDto(
      json.id,
      json.name,
      json.profile_link,
      json.not_work_from ? new Date(json.not_work_from) : null
    )
  }
}
