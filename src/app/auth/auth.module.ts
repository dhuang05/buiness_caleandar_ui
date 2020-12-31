/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthService } from './services/auth.service';

@NgModule({
        declarations: [
            LoginComponent,
            ForgetPasswordComponent,
            ResetPasswordComponent,
            LogoutComponent
        ],
        imports: [

        ],
        providers: [
            AuthService
        ],
        exports: [
            
        ]
    }
)

export class AuthModule {}
