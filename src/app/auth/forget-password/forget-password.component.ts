/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginForm } from 'src/app/auth/model/cal-model';


@Component({
  selector: 'cal-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: [ './forget-password.component.scss' ]
})
export class ForgetPasswordComponent implements OnInit {
  private emailPattern:RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/;
  loginForm: LoginForm = new LoginForm();
  errorMsg: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
  }

  forgetpassword(e: Event){
    this.errorMsg = '';
    let isValid = !this.isEmpty(this.loginForm.email) && !this.isEmpty(this.loginForm.email);
    if (isValid) {
      isValid =  this.emailPattern.test(this.loginForm.email);
      if(!isValid) {
        this.errorMsg = 'Email has wrong format';
      }
    } else {
      this.errorMsg = 'UserId and Email are both required';
    }

     if(isValid) {
      this.authService.forgetpassword(this.loginForm);
      this.errorMsg = 'reset password link is sent to your email.';
     } 
  }

  toLogin(e: Event){
    this.router.navigate(["./login"]);
  }

  isEmpty(text: string): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }
}
