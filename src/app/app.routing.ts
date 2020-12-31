/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import {Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component'
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CalAdminComponent } from './cal-admin/cal-admin.component';

const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'cal-admin', pathMatch: 'full' },
    {path: 'cal-admin', component: CalAdminComponent},
    {path: 'login', component: LoginComponent},
    {path: 'forgetpassword', component: ForgetPasswordComponent},
    {path: 'resetpassword', component: ResetPasswordComponent},
    {path: 'logout', component: LogoutComponent}
];

export const mainRouting = RouterModule.forRoot(APP_ROUTES, {useHash: true});
