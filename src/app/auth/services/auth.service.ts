/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { LoginForm, UserInfo} from '../model/cal-model';

@Injectable()
export class AuthService extends HttpService{
    public userInfo: UserInfo | undefined;

    public login (loginForm: LoginForm):  boolean {
        let result = super.post("admin/login", loginForm);
        
        return true;
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
 
}
