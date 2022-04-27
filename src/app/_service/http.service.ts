import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../_config/global.config';
import {NgForm} from '@angular/forms';
import {UserDto} from '../_dto/user.dto';
import {AuthService} from "./auth.service";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  // sendSignUpForm(form: NgForm): Observable<string> {
  //   return this.http.post(AppSettings.API_ENDPOINT + '/signUp', form.form.getRawValue()) as Observable<string>;
  // }

  sendSignInForm(form: NgForm): Observable<any> {
    const data = form.form.getRawValue();
    return this.http.get(AppSettings.API_ENDPOINT + '/dekanat/getAccount/', {
      headers: new HttpHeaders({authorization: "Basic " + btoa(data.login + ":" + data.password) })
    });
  }

  sendImageForm(form: FormData): Observable<string> {
    return this.http.post(AppSettings.API_ENDPOINT + '/profile', form,
      {headers: {Authorization: this.auth.token}}) as Observable<string>;
  }

  sendSourceAvatarForm(form: FormData): Observable<string> {
    return this.http.post(AppSettings.API_ENDPOINT + '/channels', form,
      {headers: {Authorization: this.auth.token}}) as Observable<string>;
  }

  sendLogout(): Observable<string> {
    return this.http.get(AppSettings.API_ENDPOINT + '/logout', {headers: {Authorization: this.auth.token}}) as Observable<string>;
  }
}
