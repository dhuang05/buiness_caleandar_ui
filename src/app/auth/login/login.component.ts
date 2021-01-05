/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiError, LoginForm, UserInfo } from 'src/app/model/cal-model';



@Component({
  selector: 'cal-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
  loginForm: LoginForm = new LoginForm();
  message: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
  }

  login() {
    if(!this.isEmpty(this.loginForm.password) && !this.isEmpty(this.loginForm.userId)) {
      this.message = '';
      this.authService.login (this.loginForm).subscribe(resp => {
        let json = JSON.stringify(resp);
        let error: ApiError = JSON.parse(json);
        if(error.status == null || error.status == undefined) {
          let userInfo: UserInfo = JSON.parse(json);
          this.authService.setUserInfo(userInfo);
          this.router.navigate(['cal-admin', {calendarOwnerships: userInfo.businessCalendarOwnerships}]);
        } else {
          this.message = error.message;
        }
       });
  
    } else  {
      this.message = "Please input user id and password";
    }
  }
  

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }

}
