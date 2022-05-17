import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../_config/global.config';
import {NgForm} from '@angular/forms';
import {AuthService} from "./auth.service";
import {LessonDto} from "../_dto/lesson.dto";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  sendSignInForm(form: NgForm): Observable<any> {
    const data = form.form.getRawValue();
    return this.http.post(AppSettings.API_ENDPOINT + '/token/', {
      "username": data.username,
      "password": data.password
    });
  }

  getTable(): Observable<any> {
    return this.http.get(AppSettings.API_ENDPOINT + '/dekanat/table/', {headers: this.auth.getAuthHeader()}) as Observable<any>;
  }

  editLessons(lessons: LessonDto[]): Observable<any> {
    return this.http.patch(AppSettings.API_ENDPOINT + '/dekanat/lesson/', lessons.map(a => a.toJson()), {headers: this.auth.getAuthHeader()}) as Observable<any>;
  }

  createLesson(form: NgForm): Observable<any> {
    console.log(form.form.getRawValue())
    return this.http.post(AppSettings.API_ENDPOINT + '/dekanata/lesson/', form.form.getRawValue(), {headers: this.auth.getAuthHeader() })
  }
}
