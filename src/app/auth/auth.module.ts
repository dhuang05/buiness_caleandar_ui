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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth-guard';

@NgModule({
        declarations: [
            LoginComponent,
            ForgetPasswordComponent,
            ResetPasswordComponent,
            LogoutComponent
        ],
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule
        ],
        providers: [
            AuthService
        ],
        exports: [
            LogoutComponent
        ]
    }
)

export class AuthModule {}
