import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {HttpService} from './http.service';
import {Router} from '@angular/router';
import {UserDto} from "../_dto/user.dto";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettings} from "../_config/global.config";

@Injectable()
export class AuthService {
  public user: UserDto | undefined;
  public token: string = "";
  public done = new BehaviorSubject<boolean>(false);
  public readonly AUTH_COOKIE_NAME = 'authorization';

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private router: Router) {
    this.token = this.cookieService.get(this.AUTH_COOKIE_NAME);
    if (this.token) {
      this.getUserDto().subscribe({
        next: user => {
          router.navigateByUrl((router.url.indexOf('?') > 0 ? '/table?' + router.url.split('?')[1] : '/table'));
          this.user = user;
          this.done.next(true);
        },
        error: err => {
          if (err.status == 403) {
            this.token = ""
            cookieService.delete(this.AUTH_COOKIE_NAME)
            router.navigateByUrl("/signIn?error=" + "Требуется повторная авторизация")
          } else {
            router.navigate(["signIn"])
          }
          this.done.next(true);
        }
      })
    } else {
      this.done.next(true);
    }
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({Authorization: this.token});
  }

  getUserDto(): Observable<UserDto> {
    return this.http.get(AppSettings.API_ENDPOINT + '/dekanat/getAccount/', {
      headers: this.getAuthHeader()
    }) as Observable<UserDto>;
  }

  setAuthCookie(value: string, remember?: boolean): void {
    if (remember) {
      this.cookieService.set(this.AUTH_COOKIE_NAME, value, {expires: 90, path: '/'});
    } else {
      this.cookieService.set(this.AUTH_COOKIE_NAME, value, {path: '/'});
    }
  }

  deleteAuthCookie(): void {
    this.cookieService.delete(this.AUTH_COOKIE_NAME);
  }
}
