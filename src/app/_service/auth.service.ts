import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserDto} from "../_dto/user.dto";
import {BehaviorSubject, first, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettings} from "../_config/global.config";

@Injectable()
export class AuthService {
  public user: UserDto | undefined;
  public tokenAccess: string = "";
  public tokenRefresh: string = "";
  public done = new BehaviorSubject<boolean>(false);
  public readonly ACCESS_COOKIE_NAME = 'access';
  public readonly REFRESH_COOKIE_NAME = 'refresh';

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute) {
    this.tokenAccess = this.cookieService.get(this.ACCESS_COOKIE_NAME);
    this.tokenRefresh = this.cookieService.get(this.REFRESH_COOKIE_NAME);
    if (this.tokenAccess) {
      this.handleAccess()
    } else {
      if (this.tokenRefresh) {
        this.handleRefresh()
      } else {
        this.done.next(true);
      }
    }
  }

  public handleRefresh() {
    this.getAccessToken().subscribe({
      next: value => {
        this.tokenAccess = 'JWT ' + value.access
        this.setAccessCookie(this.tokenAccess, true)
        this.handleAccess()
      },
      error: err => {
        if (err.status == 403) {
          this.tokenRefresh = ""
          this.cookieService.delete(this.REFRESH_COOKIE_NAME)
        } else {
          this.router.navigate(["signIn?error=" + err.statusText])
        }
        this.done.next(true);
      }
    })
  }

  public handleAccess(path: string | undefined = undefined) {
    this.getUserDto().subscribe({
      next: user => {
        this.route.queryParams.pipe(first()).subscribe(queryParams => {
          let a: Params = JSON.parse(JSON.stringify(queryParams))
          let from = a['from']
          delete a['from']
          this.router.navigate((from || path || this.router.url || '/main/table').substring(1).split('/'), {queryParams: a})
        }).unsubscribe()
        this.user = user
        this.done.next(true)
      },
      error: err => {
        if (err.status == 403) {
          this.tokenAccess = ""
          this.cookieService.delete(this.ACCESS_COOKIE_NAME)
          this.handleRefresh()
        } else {
          this.router.navigate(["signIn?error=" + err.statusText])
        }
        this.done.next(true);
      }
    })
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({Authorization: this.tokenAccess});
  }

  getAccessToken(): Observable<{refresh: string, access: string}> {
    return this.http.post(AppSettings.API_ENDPOINT + '/token/refresh/',
      {refresh: this.tokenRefresh}) as Observable<any>
  }

  getUserDto(): Observable<UserDto> {
    return this.http.get(AppSettings.API_ENDPOINT + '/dekanat/account/', {
      headers: this.getAuthHeader()
    }) as Observable<UserDto>;
  }

  setAccessCookie(value: string, remember?: boolean): void {
    if (remember) {
      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + 29)
      this.cookieService.set(this.ACCESS_COOKIE_NAME, value, {expires, path: '/'});
    } else {
      this.cookieService.set(this.ACCESS_COOKIE_NAME, value, {path: '/'});
    }
  }

  setRefreshCookie(value: string, remember?: boolean): void {
    if (remember) {
      let expires = new Date()
      expires.setDate(expires.getHours() + 23)
      expires.setMinutes(expires.getMinutes() + 59)
      this.cookieService.set(this.REFRESH_COOKIE_NAME, value, {expires, path: '/'});
    } else {
      this.cookieService.set(this.REFRESH_COOKIE_NAME, value, {path: '/'});
    }
  }

  deleteAuthCookie(): void {
    this.cookieService.delete(this.ACCESS_COOKIE_NAME);
    this.cookieService.delete(this.REFRESH_COOKIE_NAME);
  }
}
