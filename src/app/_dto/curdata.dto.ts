import {BlockDto} from "./block.dto";
import {ChangeDto} from "./change.dto";
import {CourseDto} from "./course.dto";
import {GroupDto} from "./group.dto";
import {LessonDto} from "./lesson.dto";
import {SubjectDto} from "./subject.dto";

export class CurDataDto {
  constructor(public readonly blocks: BlockDto[],
              public readonly changes: ChangeDto[],
              public readonly course: CourseDto,
              public readonly groups: GroupDto[],
              //Map<group_number, lessons>[day]
              public readonly lessons: Map<string, LessonDto[]>[],
              public readonly subjects: SubjectDto[],
              public readonly classrooms: (string | null)[]) {
  }
}
