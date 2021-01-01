/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginForm } from 'src/app/auth/model/cal-model';


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
    if(this.loginForm.password != null && this.loginForm.password.length > 0 && this.loginForm.userId != null && this.loginForm.userId.length > 0 ) {
      this.message = '';
      this.authService.login (this.loginForm).subscribe(resp => {
        console.log("Return for login=" + JSON.stringify(resp));
       
        //this.router.navigate(['cal-admin']);
     
    });
  
    } else  {
      this.message = "Please input user id and password";
    }
  }
  
}
