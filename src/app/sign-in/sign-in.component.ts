import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpService} from '../_service/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from "../_service/auth.service";

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
              public router: Router,
              private location: Location) {
    route.queryParams.subscribe((queryParam: any) => {
      this.info = queryParam.info ? decodeURIComponent(queryParam.info).replace(/\+/g, ' ') : "";
      this.error = queryParam.error ? decodeURIComponent(queryParam.error).replace(/\+/g, ' ') : "";
      if (this.info || this.error) {
        location.replaceState('/signIn');
      }
    });
    authService.done.subscribe(done => {
      this.isReady = done
    })
  }



  submit(form: NgForm): void {
    this.error = "";
    this.info = "";
    const raw = form.form.getRawValue()
    this.httpService.sendSignInForm(form).subscribe({
      next: data => {
        this.authService.token = "Basic " + btoa(raw.login + ":" + raw.password);
        console.log(data.login + ":" + data.password)
        this.authService.user = data;
        this.authService.done.next(true);
        this.authService.setAuthCookie(this.authService.token, form.form.value.remember);
        this.router.navigate(['table']);
      },
      error: error => {
        this.error = error.statusText;
        this.authService.done.next(true);
      }});
  }
}
