import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {SignInComponent} from "./sign-in/sign-in.component";
import {RouterModule, Routes} from "@angular/router";
import {HttpService} from "./_service/http.service";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./_service/auth.service";
import {TableComponent} from "./table/table.component";
import {AuthGuard} from "../guard/auth.guard";
import {HeaderComponent} from "./header/header.component";
import {TeacherComponent} from "./teacher/teacher.component";

const appRoutes: Routes = [
  {path: 'signIn', component: SignInComponent},
  {
    path: 'main',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'table', component: TableComponent},
      {path: 'teacher', component: TeacherComponent}
    ]
  },
  {path: '**', redirectTo: '/signIn'}
];

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    TableComponent,
    HeaderComponent,
    TeacherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [HttpService, CookieService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
