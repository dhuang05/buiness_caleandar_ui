/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginForm } from '../model/cal-model';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'cal-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

  loginForm: LoginForm = new LoginForm();
  showUserRegistration = true;
  showResetPassword = true;
  message: string = '';


  isEnglish: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }


  ngOnInit() {
  }

  login(e: Event) {
    if(this.loginForm.password != null && this.loginForm.password.length > 0 && this.loginForm.userId != null && this.loginForm.userId.length > 0 ) {
      this.message = '';
      let logined : boolean = this.authService.login (this.loginForm);
      if(!logined) {
        this.message = "Wrong userid or password";
      } else {
        this.router.navigate(["../../cal-admin"]);
      }

    }else  {
      this.message = "Please input user id and password";
    }
  }
  
}
