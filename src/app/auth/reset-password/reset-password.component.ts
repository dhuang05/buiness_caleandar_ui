/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ApiError, LoginForm, UserInfo } from 'src/app/model/cal-model';

@Component({
  selector: 'cal-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [ './reset-password.component.scss' ]
})
export class ResetPasswordComponent implements OnInit {
  message: string = '';
  loginForm: LoginForm = new LoginForm();
  repeatNewpepassword = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
  }

  resetpassword(e: Event){
    this.message = '';
    let isAllFilled: boolean = !this.isEmpty(this.loginForm.userId) && !this.isEmpty(this.loginForm.password) && !this.isEmpty(this.loginForm.newPassword) && !this.isEmpty(this.repeatNewpepassword);
    if(isAllFilled){
      if(this.loginForm.newPassword.trim() == this.repeatNewpepassword.trim()) {
        this.authService.resetpassword(this.loginForm).subscribe(resp => {
          let json = JSON.stringify(resp);
          let error: ApiError = JSON.parse(json);
          if(error.status == null || error.status == undefined) {
            let userInfo: UserInfo = JSON.parse(json);
            this.authService.setUserInfo(userInfo);
            this.router.navigate(['cal-admin', {calendarOwnerships: userInfo.businessCalendarOwnerships}]);
            this.router.navigate(['login']);
          } else {
            this.message = error.message;
          }
         },
         error => {
          if(error.status >= 400 && error.status < 500 ){
            this.message = 'User name or old password not matched.';
          } else if(error.status >= 500 ) {
            this.message = 'Service not available.';
          }
           console.log("Error: ", error)
          }
         );
    
      } else {
        this.message = 'New password and the Retype password matched.';
      }

    } else {
      this.message = 'User id, password and new password, retype password are all required.';
    }
  }

  

  toLogin(e: Event){
    this.router.navigate(["./login"]);
  }


  isEmpty(text: string){
    return text == null || text == undefined || text.trim().length == 0;
  }
}
