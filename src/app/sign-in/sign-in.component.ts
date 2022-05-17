import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpService} from '../_service/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../_service/auth.service";
import {first} from "rxjs";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  error: string = "";
  info: string = "";
  isReady: boolean = false

  constructor(private route: ActivatedRoute,
              private httpService: HttpService,
              private authService: AuthService,
              public router: Router) {
    route.queryParams.pipe(first()).subscribe(queryParam => {
      this.info = queryParam['info'] ? decodeURIComponent(queryParam['info']).replace(/\+/g, ' ') : "";
      this.error = queryParam['error'] ? decodeURIComponent(queryParam['error']).replace(/\+/g, ' ') : "";
      router.navigate([], {queryParams: {info: null, error: null}, queryParamsHandling: "merge"})
    });
    authService.done.subscribe(done => {
      if (done) {
        this.isReady = done
      }
    })
  }

  submit(form: NgForm): void {
    this.error = "";
    this.info = "";
    this.httpService.sendSignInForm(form).subscribe({
      next: data => {
        this.authService.tokenAccess = "JWT " + data.access;
        this.authService.tokenRefresh = data.refresh;
        this.authService.setAccessCookie(this.authService.tokenAccess, form.form.value.remember);
        this.authService.setRefreshCookie(this.authService.tokenRefresh, form.form.value.remember);
        this.authService.handleAccess("/main/table")
      },
      error: err => {
        this.error = err.statusText;
        this.authService.done.next(true);
      }});
  }
}
