/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginForm, UserInfo } from 'src/app/model/cal-model';
import { HttpService } from 'src/app/service/http.service';



@Injectable({
    providedIn: 'root',
  })
export class CalAdminService extends HttpService{
    public fetchCalendarInst (calId: string) {
        return super.get("api/admin/calendar/inst/" + calId);
    }
}