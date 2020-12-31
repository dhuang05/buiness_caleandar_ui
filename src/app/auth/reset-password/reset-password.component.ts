/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LoginForm } from '../model/cal-model';

@Component({
  selector: 'cal-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [ './reset-password.component.scss' ]
})
export class ResetPasswordComponent implements OnInit {
  message: string = '';
  loginForm: LoginForm = new LoginForm();

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
  }

  resetpassword(e: Event){
    this.message = '';
    let isValid: boolean = !this.isEmpty(this.loginForm.userId) && !this.isEmpty(this.loginForm.password) && !this.isEmpty(this.loginForm.newPassword);
    if(isValid){
      this.authService.resetpassword(this.loginForm);
    } else {
      this.message = 'User id, password and new password are all required.';
    }
  }

  

  toLogin(){
    this.router.navigate(["../login"]);
  }


  isEmpty(text: string){
    return text == null || text == undefined || text.trim().length == 0;
  }
}
