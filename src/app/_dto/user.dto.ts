import {InstituteDto} from "./institute.dto";

export class UserDto {
  constructor(public readonly first_name: string,
              public readonly institute: InstituteDto,
              public readonly username: string) {
  }
}

