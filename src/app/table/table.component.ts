import {AfterViewInit, Component} from "@angular/core";
import {HeaderComponent} from "../header/header.component";
import {GroupDto} from "../_dto/group.dto";
import {LessonDto} from "../_dto/lesson.dto";
import {Time} from "@angular/common";
import {SubjectDto} from "../_dto/subject.dto";
import {HttpService} from "../_service/http.service";
import {TeacherDto} from "../_dto/teacher.dto";
import {IndexName} from "../_helper/helper";
import {Modal} from "bootstrap";
import {NgForm} from "@angular/forms";

export declare type DropDownSubject = { lesson: LessonDto | null; top: number; left: number, index: number }
export declare type ShowingTime = { lesson: LessonDto | null; top: number; left: number }

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit{
  public readonly daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
  //Map<group_number, lessons>[day]
  public dayStart: Time = {hours: 8, minutes: 0}
  public dayEnd: Time = {hours: 21, minutes: 0}
  public subjectSearchResults: SubjectDto[] | undefined
  public classroomSearchResults: (string | null)[] | undefined
  public teacherSearchResults: TeacherDto[] | undefined
  public typeSearchResults: IndexName[] | undefined
  public paritySearchResults: IndexName[] | undefined
  public dayDuration = this.dayEnd.hours * 60 + this.dayEnd.minutes - this.dayStart.hours * 60 + this.dayStart.minutes
  public dropDownSubject: DropDownSubject
  public dropDownClassroom: DropDownSubject
  public dropDownTeacher: DropDownSubject
  public dropDownType: DropDownSubject
  public dropDownParity: DropDownSubject

  public typeNames = LessonDto.typeNames
  public parityNames = LessonDto.parityName

  public createLessonModal: Modal | undefined
  public showingTime: ShowingTime

  constructor(public hc: HeaderComponent, public http: HttpService) {
    this.dropDownTeacher = {lesson: null, left: 0, top: 0, index: 0}
    this.dropDownSubject = {lesson: null, left: 0, top: 0, index: 0}
    this.dropDownType = {lesson: null, left: 0, top: 0, index: 0}
    this.dropDownParity = {lesson: null, left: 0, top: 0, index: 0}
    this.dropDownClassroom = {lesson: null, left: 0, top: 0, index: 0}
    this.showingTime = {lesson: null, left: 0, top: 0}
    this.hc.selectCourse(this.hc.data?.courses[0]!)
  }

  ngAfterViewInit(): void {
    $(document).on('select2:open', () => {
      // @ts-ignore
      document.querySelector('.select2-search__field').focus();
    });
    const modal = $('#createLessonModal')
    // @ts-ignore
    $('#createLessonSubject').select2({
      placeholder: "Не выбран",
      dropdownParent: modal,
      width: "100%"
    });
    // @ts-ignore
    $('#createLessonClassroom').select2({
      placeholder: "Не выбран",
      dropdownParent: modal,
      allowClear: true,
      width: "100%",
      tags: true
    });
    //@ts-ignore
    $('#createLessonDay').select2({
      placeholder: "Не выбран",
      dropdownParent: modal,
      width: "100%"
    });
    //@ts-ignore
    $('#createLessonTeacher').select2({
      placeholder: "Не выбран",
      dropdownParent: modal,
      width: "100%"
    });
    //@ts-ignore
    $('#createLessonType').select2({
      placeholder: "Не выбран",
      dropdownParent: modal,
      width: "100%"
    });
    //@ts-ignore
    $('#createLessonParity').select2({
      placeholder: "Не выбрана",
      dropdownParent: modal,
      width: "100%"
    });
    //@ts-ignore
    $('#createLessonGroup').select2({
      placeholder: "Не выбрана",
      dropdownParent: modal,
      width: "100%"
    });
    this.createLessonModal = new Modal(document.getElementById("createLessonModal")!)
  }

  public timeToString(time: Time | undefined) {
    return time ? `${time.hours}:${time.minutes < 10 ? time.minutes + '0' : time.minutes}` : ''
  }

  public createNewLesson(form: NgForm) {
    console.log(form.controls)
    this.http.createLesson(form)
  }

  public createLessonClick(day: number, group: GroupDto) {
    this.createLessonModal!.show()
  }

  public clickLesson(lesson: LessonDto, event: MouseEvent) {
    this.createLessonModal!.show()
    return false
  }

  public clickSubjectName(lesson: LessonDto) {
    this.subjectSearchResults = this.hc.curData!.subjects
    let rect = document.getElementById('ls' + lesson.id)!.children[0].getBoundingClientRect()
    this.dropDownSubject = {lesson, top: rect.top, left: rect.left - 2, index: 0}
  }

  public clickClassroom(lesson: LessonDto) {
    this.classroomSearchResults = this.hc.curData?.classrooms
    let rect = document.getElementById('ls' + lesson.id)!.children[1].getBoundingClientRect()
    this.dropDownClassroom = {lesson, top: rect.top, left: rect.right - 148, index: 0}
  }

  public clickTeacherName(lesson: LessonDto) {
    this.teacherSearchResults = this.hc.data!.teachers
    let rect = document.getElementById('ls' + lesson.id)!.children[2].getBoundingClientRect()
    this.dropDownTeacher = {lesson: lesson, top: rect.top, left: rect.left - 2, index: 0}
  }

  public clickTypeName(lesson: LessonDto) {
    this.typeSearchResults = LessonDto.typeNames
    let rect = document.getElementById('ls' + lesson.id)!.children[3].getBoundingClientRect()
    this.dropDownType = {lesson, top: rect.top, left: rect.left - 2, index: 0}
  }

  public clickParityName(lesson: LessonDto) {
    this.paritySearchResults = LessonDto.parityName
    let rect = document.getElementById('ls' + lesson.id)!.children[4].getBoundingClientRect()
    this.dropDownParity = {lesson, top: rect.top, left: rect.right - 148, index: 0}
  }

  public afterDropDownSubject() {
    document.getElementById('dropDownSubjectSearch')!.focus()
    return ''
  }

  public afterDropDownClassroom() {
    document.getElementById('dropDownClassroomSearch')!.focus()
    return ''
  }

  public afterDropDownTeacher() {
    document.getElementById('dropDownTeacherSearch')!.focus()
    return ''
  }

  public afterDropDownType() {
    document.getElementById('dropDownTypeSearch')!.focus()
    return ''
  }

  public afterDropDownParity() {
    document.getElementById('dropDownParitySearch')!.focus()
    return ''
  }

  public editSubject(subject: SubjectDto) {
    if (!subject) return
    this.dropDownSubject.lesson!.subject = subject
    if (this.dropDownSubject.lesson!.id > 0) {
      this.http.editLessons([this.dropDownSubject.lesson!]).subscribe({
        error: err => this.hc.error = err.error.text
      })
    }
    this.dropDownSubject.lesson = null
  }

  public editClassroom(classroom: string | null) {
    if (classroom === undefined) return
    this.dropDownClassroom.lesson!.classroom = classroom
    this.http.editLessons([this.dropDownClassroom.lesson!]).subscribe({
      error: err => this.hc.error = err.error.text
    })
    this.dropDownClassroom.lesson = null
  }

  public editTeacher(teacher: TeacherDto) {
    if (!teacher) return
    this.dropDownTeacher.lesson!.teacher = teacher
    this.http.editLessons([this.dropDownTeacher.lesson!]).subscribe({
      error: err => this.hc.error = err.error.text
    })
    this.dropDownTeacher.lesson = null
  }

  public editType(type: IndexName) {
    if (!type) return
    this.dropDownType.lesson!.type = type.id
    this.http.editLessons([this.dropDownType.lesson!]).subscribe({
      error: err => this.hc.error = err.error.text
    })
    this.dropDownType.lesson = null
  }

  public editParity(parity: IndexName) {
    if (!parity) return
    this.dropDownParity.lesson!.is_even_week = parity.id
    this.http.editLessons([this.dropDownParity.lesson!]).subscribe({
      error: err => this.hc.error = err.error.text
    })
    this.dropDownParity.lesson = null
  }

  public searchSubject(name: string | null) {
    this.dropDownSubject.index = 0
    this.subjectSearchResults = this.hc.curData!.subjects.filter(value => value.name.toLowerCase().startsWith(name?.toLowerCase() || ''))
  }

  public searchClassroom(name: string | null) {
    this.dropDownClassroom.index = 0
    this.classroomSearchResults = this.hc.curData!.classrooms.filter(value => value?.toLowerCase()?.startsWith(name?.toLowerCase() || ''))
  }

  public searchTeacher(name: string | null) {
    this.dropDownTeacher.index = 0
    this.teacherSearchResults = this.hc.data!.teachers.filter(value => value.name.toLowerCase().startsWith(name?.toLowerCase() || ''))
  }

  public searchType(name: string | null) {
    this.dropDownType.index = 0
    this.typeSearchResults = LessonDto.typeNames.filter(value => value.name.toLowerCase().startsWith(name?.toLowerCase() || ''))
  }

  public searchParity(name: string | null) {
    this.dropDownParity.index = 0
    this.paritySearchResults = LessonDto.parityName.filter(value => value.name.toLowerCase().startsWith(name?.toLowerCase() || ''))
  }

  public prevLesson: LessonDto | undefined
  public calcOffset(lesson: LessonDto, index: number): number {
    let time = this.prevLesson?.group == lesson.group ? this.prevLesson.end_time : this.dayStart
    this.prevLesson = lesson
    return 624 * ((lesson.start_time.hours - time.hours) * 60 + lesson.start_time.minutes - time.minutes) / this.dayDuration
  }

  fixStyle() {
    return `max-content repeat(${this.hc.curData!.groups.length}, 250px)`
  }
}
