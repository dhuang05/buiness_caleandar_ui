/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiError, BusinessCalendarOwnership, LoginForm, User, UserInfo } from 'src/app/model/cal-model';
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
        //usr to type object
        userInfo.user = Object.setPrototypeOf(userInfo.user, User.prototype);
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
        return  super.post("api/admin/user/resetpassword", loginForm);
    }
 
    public forgetpassword (loginForm: LoginForm) {
        let result = super.post("api/admin/user/forgetpassword", LoginForm);
    }

    public isLoggedIn() : boolean {
        return this.userInfo != undefined;
    }

    public reloadUserCalendarOwnerships() {
        if(this.userInfo && this.userInfo?.user) {
            let loginForm = new LoginForm();
            loginForm.userId = this.userInfo?.user.userId;
            super.post("api/admin/user_calendar", loginForm).subscribe(resp => {
                let json = JSON.stringify(resp);
                let error: ApiError = JSON.parse(json);
                if(error.status == null || error.status == undefined) {
                  let ownerships: BusinessCalendarOwnership[] = JSON.parse(json);
                  if(ownerships && this.userInfo) {
                    this.userInfo.businessCalendarOwnerships = ownerships;
                  }
                } 
               });
        }
    }
}
