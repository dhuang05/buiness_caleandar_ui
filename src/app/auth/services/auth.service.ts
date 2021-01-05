/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginForm, UserInfo } from 'src/app/model/cal-model';
import { HttpService } from 'src/app/service/http.service';



@Injectable({
    providedIn: 'root',
  })
export class AuthService extends HttpService{
    private userInfo: UserInfo | undefined;
    private userInfoEmitter: EventEmitter<UserInfo> = new EventEmitter();

    public getUserInfoEventEmitter(){
        return this.userInfoEmitter;
    }
    
    public setUserInfo(userInfo: UserInfo) {
        this.userInfo = userInfo;
        this.userInfoEmitter.emit(this.userInfo);
    }
    public getUserInfo(): UserInfo {
        return this.userInfo as UserInfo;
    }
    
    public hasUser(): boolean {
        return this.userInfo != undefined && this.userInfo.user != undefined;
    }

    public login (loginForm: LoginForm):  Observable<any> {
        return super.post("api/admin/user/login", loginForm);
    }

    public logout (userId: string) {
        let result = super.get("api/admin/user/logout/" + userId);
        this.userInfo = undefined;
    }

    public resetpassword (loginForm: LoginForm) {
        return  super.get("api/admin/user/resetpassword");
    }
 
    public forgetpassword (loginForm: LoginForm) {
        let result = super.post("api/admin/user/forgetpassword", LoginForm);
    }

    public isLoggedIn() : boolean {
        return this.userInfo != undefined;
    }
}
