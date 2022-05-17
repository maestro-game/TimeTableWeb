import {Component} from "@angular/core";
import {AuthService} from "../_service/auth.service";
import {UserDto} from "../_dto/user.dto";
import {HttpService} from "../_service/http.service";
import {DataDto} from "../_dto/data.dto";
import {CourseDto} from "../_dto/course.dto";
import {LessonDto} from "../_dto/lesson.dto";
import {CurDataDto} from "../_dto/curdata.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public user: UserDto
  public curData: CurDataDto | undefined
  public error = ""
  public data: DataDto | undefined

  constructor(public authService: AuthService, public httpService: HttpService, public router: Router) {
    if (this.authService.user) {
      this.user = this.authService.user
      this.loadTable()
    } else {
      throw Error("user was undefined")
    }
  }

  public selectCourse(course: CourseDto) {
    //Map<group_number, lessons>[day]
    let classrooms = new Set<string | null>()
    let lessons: Map<string, LessonDto[]>[] = []
    this.data!.lessons.forEach(value => {
      classrooms.add(value.classroom)
      let day = lessons![value.day_name]
      if (day) {
        let group = day.get(value.group.group_number)
        if (group) {
          group.push(value)
          group.sort((a, b) => a.start_time.hours * 60 + a.start_time.minutes - b.start_time.hours * 60 - b.start_time.minutes)
        } else {
          day.set(value.group.group_number, [value])
        }
      } else {
        lessons![value.day_name] = new Map<string, LessonDto[]>([[value.group.group_number, [value]]])
      }
    })
    this.curData = new CurDataDto(
      this.data!.blocks.filter(value => value.course == course),
      this.data!.changes.filter(value => value.lesson.group.course == course),
      course,
      this.data!.groups.filter(value => value.course.id == course.id),
      lessons,
      this.data!.subjects.filter(value => value.block.course == course),
      Array.from(classrooms.values()).sort()
    )
  }

  signOut() {
    this.authService.deleteAuthCookie()
    this.authService.user = undefined
    this.authService.tokenAccess = ""
    this.authService.tokenRefresh = ""
  }

  loadTable() {
    this.httpService.getTable().subscribe({
      next: value => {
        this.data = DataDto.fromJSON(value)
      },
      error: err => {
        this.error = err.statusText
      }
    })
  }

  reloadTable() {
    this.error = ""
    this.data = undefined
    this.loadTable()
    return false;
  }

  nav(strings: string[]) {
    this.router.navigate(strings)
    return false
  }
}
