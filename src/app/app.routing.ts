/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component'
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CalAdminComponent } from './cal-admin/cal-admin.component';
import { AuthGuard } from './auth-guard';

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'cal-admin', pathMatch: 'full' },
    { path: 'cal-admin', component: CalAdminComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'forgetpassword', component: ForgetPasswordComponent },
    { path: 'resetpassword', component: ResetPasswordComponent },
    { path: 'logout', component: LogoutComponent },
];

const routerOptions: ExtraOptions = { 
    scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled', 
    scrollOffset: [0, 64], 
    useHash: true };

export const mainRouting = RouterModule.forRoot(APP_ROUTES, routerOptions);