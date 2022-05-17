import {ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from "../app/_service/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!!this.authService.user) {
      return true
    } else {
      let a: Params = JSON.parse(JSON.stringify(route.queryParams))
      a['from'] = state.url;
      this.router.navigate(["/signIn"],
        {queryParams: a, queryParamsHandling: "merge"})
      return false;
    }
  }
}
