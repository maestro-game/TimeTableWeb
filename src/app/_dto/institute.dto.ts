import {UniversityDto} from "./university.dto";

export class InstituteDto {
  constructor(public readonly id: 1,
              public readonly link: "https://kpfu.ru/itis",
              public readonly name: "Институт информационных технологий и интеллектуальных систем",
              public readonly short_name: "ИТИС",
              public readonly university: UniversityDto) {
  }
}
