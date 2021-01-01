/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginForm, UserInfo } from 'src/app/auth/model/cal-model';
import { HttpService } from 'src/app/service/http.service';



@Injectable({
    providedIn: 'root',
  })
export class AuthService extends HttpService{
    public userInfo: UserInfo | undefined;

    public login (loginForm: LoginForm):  Observable<any> {
        return super.post("admin/login", loginForm);
    }

    public logout () {
        let result = super.get("admin/logout");
        this.userInfo = undefined;
    }

    public resetpassword (loginForm: LoginForm) {
        let result = super.get("admin/resetpassword");
    }
 
    public forgetpassword (loginForm: LoginForm) {
        let result = super.post("admin/forgetpassword", LoginForm);
    }
 
    public isLoggedIn() : boolean {
        return this.userInfo != undefined;
    }
}
