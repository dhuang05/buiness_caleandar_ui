/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Util } from 'src/app/common/util';
import { ApiError, BusinessCalendarOwnership, LoginForm, Organization, User, UserInfo } from 'src/app/model/cal-model';
import { HttpService } from 'src/app/service/http.service';



@Injectable({
    providedIn: 'root',
})
export class AuthService extends HttpService {
    private userInfo: UserInfo | undefined;
    private userInfoEmitter: EventEmitter<UserInfo> = new EventEmitter();

    public static SUPER_ADMIN_ROLE: string = "SUPER_ADMIN_ROLE";
    public static ADMIN_ROLE: string = "ADMIN_ROLE";
    public static API_ROLE: string = "API_ROLE";
    public static TRIAL_ROLE = "TRIAL_ROLE";

    public getUserInfoEventEmitter() {
        return this.userInfoEmitter;
    }

    public setUserInfo(userInfo: UserInfo) {
        this.userInfo = userInfo;
        //usr to type object
        userInfo.user = Object.setPrototypeOf(userInfo.user, User.prototype);
        this.userInfoEmitter.emit(this.userInfo);
    }

    public hasSupperRole(): boolean {
        return this.hasRoleOf(AuthService.SUPER_ADMIN_ROLE);
    }

    public hasTrialRole(): boolean {
        return this.hasRoleOf(AuthService.TRIAL_ROLE);
    }

    public hasAdminRoles(): boolean {
        return this.hasRoleOf(AuthService.ADMIN_ROLE) || this.hasRoleOf(AuthService.SUPER_ADMIN_ROLE);
    }

    public hasRoleOf(aRole: string): boolean {
        if (this.userInfo && this.userInfo.user && this.userInfo.user.roles) {
            for (let role of this.userInfo.user.roles) {
                if (role.roleId.trim().toUpperCase() == aRole.trim().toUpperCase()) {
                    return true;
                }
            }
        }

        return false;
    }

    public getUserInfo(): UserInfo {
        return this.userInfo as UserInfo;
    }

    public hasUser(): boolean {
        return this.userInfo != undefined && this.userInfo.user != undefined;
    }

    public login(loginForm: LoginForm): Observable<any> {
        return super.post("api/admin/user/login", loginForm);
    }

    public logout(userId: string) {
        let result = super.get("api/admin/user/logout/" + userId);
        this.userInfo = undefined;
    }

    public resetpassword(loginForm: LoginForm) {
        return super.post("api/admin/user/resetpassword", loginForm);
    }

    public forgetpassword(loginForm: LoginForm) {
        let result = super.post("api/admin/user/forgetpassword", LoginForm);
    }

    public saveUser(user: User) {
        let url = "api/admin/user";
        let result = super.post(url, user);
        return result;
    }

    public saveOrganization(organization: Organization) {
        let url = "api/admin/organization";
        let result = super.post(url, organization);
        return result;
    }

    public findUsers(orgId: string, keyword: string) {
        let url = "api/admin/user";
        if(!Util.isEmpty(orgId) || !Util.isEmpty(keyword)) {
            url += "?" 
            let hasParam = false;
            if(!Util.isEmpty(orgId)) {
                if(hasParam) {
                    url += "&"
                }
                url += "orgId=" + orgId; 
                hasParam = true;
            }

            if(!Util.isEmpty(keyword)) {
                if(hasParam) {
                    url += "&"
                }
                url += "keyword=" + keyword; 
                hasParam = true;
            }
        }
        let result = super.get(url);
        return result;
    }

    public findOrganizations(userId: string, keyword: string) {
        let url = "api/admin/organization";
        if(!Util.isEmpty(userId) || !Util.isEmpty(keyword)) {
            url += "?" 
            let hasParam = false;
            if(!Util.isEmpty(userId)) {
                if(hasParam) {
                    url += "&"
                }
                url += "userId=" + userId; 
                hasParam = true;
            }

            if(!Util.isEmpty(keyword)) {
                if(hasParam) {
                    url += "&"
                }
                url += "keyword=" + keyword; 
                hasParam = true;
            }
        }
        let result = super.get(url);
        return result;
    }


    public isLoggedIn(): boolean {
        return this.userInfo != undefined;
    }

    public reloadUserCalendarOwnerships() {
        if (this.userInfo && this.userInfo?.user) {
            let loginForm = new LoginForm();
            loginForm.userId = this.userInfo?.user.userId;
            super.post("api/admin/user_calendar", loginForm).subscribe(resp => {
                let json = JSON.stringify(resp);
                let error: ApiError = JSON.parse(json);
                if (error.status == null || error.status == undefined) {
                    let ownerships: BusinessCalendarOwnership[] = JSON.parse(json);
                    if (ownerships && this.userInfo) {
                        this.userInfo.businessCalendarOwnerships = ownerships;
                    }
                }
            });
        }
    }



}
