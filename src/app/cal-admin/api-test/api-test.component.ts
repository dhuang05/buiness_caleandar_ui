import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContentDialogComponent } from 'src/app/common/content-dialog/content-dialog.component';
import { InfoDialogComponent } from 'src/app/common/info-dialog/info-dialog.component';
import { Util } from 'src/app/common/util';
import { ApiError, BusinessCalendarOwnership, UserInfo } from 'src/app/model/cal-model';
import { DataSet } from 'src/app/model/data-set';
import { CalAdminService } from '../services/cal_admin.service';

@Component({
  selector: 'cal-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss']
})
export class ApiTestComponent implements OnInit, OnDestroy {
  message: string | undefined;
  timezones: string[] = DataSet.timezones;
  calendarOwnerships: BusinessCalendarOwnership[] | undefined;
  timeSlotRequest = new TimeSlotRequest();
  calInfoRequest = new CalInfoRequest();

  requestTimeSlotError = "";
  requestCalInfoError = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private calAdminService: CalAdminService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
  }

  ngOnInit() {
    this.calAdminService.getUserAccessibleCalednars().subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("API json: " + json);
      let error: ApiError = JSON.parse(json);
      if(error.status == null || error.status == undefined) {
        this.calendarOwnerships =  JSON.parse(json);
      } else {
        this.message = error.message;
      }
     },
       error => {
        this.message = Util.handleError(error);
       });
  }

  ngOnDestroy(){
   
  }

  getCalendarInfoUrl() : string {
    let url = "/api/calendar/inst/info";
    if(this.calInfoRequest.calId) {
      url += "/" + this.calInfoRequest.calId;
    }else {
      url += "/{calId}";
    }
    if(this.calInfoRequest.year) {
      url += "/" + this.calInfoRequest.year;
    }else {
      url += "/{year}";
    }

    return url;
  } 
  
  getTimeslotUrl() : string{
    let url = "/api/calendar/businesstime";
    if(this.timeSlotRequest.calId) {
      url += "/" + this.timeSlotRequest.calId;
    }else {
      url += "/{calId}";
    }
    //
    if(this.timeSlotRequest.getDuration()) {
      url += "/" + this.timeSlotRequest.getDuration();
    }else {
      url += "/{duration}";
    }
    if(this.timeSlotRequest.timezoneId || this.timeSlotRequest.sinceDateTime) {
      url += "?";
      let hasParam = false;
      if(this.timeSlotRequest.timezoneId) {
        if(hasParam) {
          url += "&";
        }
        url += "localZoneId=" + this.timeSlotRequest.timezoneId;
        hasParam = true;
      }

      if(this.timeSlotRequest.sinceDateTime) {
        if(hasParam) {
          url += "&";
        }
        url += "sinceDateTime=" + this.timeSlotRequest.sinceDateTime;
        hasParam = true;
      }
    }
    return url;

  }
  requestCalInfo() {
    let hasError = false;
    this.requestCalInfoError = "";
    if(!this.calInfoRequest.calId) {
      this.requestCalInfoError += "CalId required; ";
      hasError = true;
    }
    if(!this.calInfoRequest.year) {
      this.requestCalInfoError += "Year required; ";
      hasError = true;
    }
    if(hasError) {
      return;
    }
    
    this.calAdminService.genericGet(this.getCalendarInfoUrl()).subscribe(resp => {
      let json = JSON.stringify(resp, null, 2);
      console.log(json);
      let error: ApiError = JSON.parse(json);
      if(error.status == null || error.status == undefined) {
        let result =  "\n" + json as string;
        const dialogRef = this.dialog.open(ContentDialogComponent, {
          width: '500px',
          height: '500px',
          data: result,
        });
      } else {
        this.requestCalInfoError = error.message;
      }
     },
     error => {
      this.requestCalInfoError = Util.handleError(error);
     }
     );
    
  }

  requestTimeSlot() {
    let hasError = false;
    this.requestTimeSlotError = "";
    if(!this.timeSlotRequest.calId) {
      this.requestTimeSlotError += "CalId required; ";
      hasError = true;
    }
    if(!this.timeSlotRequest.getDuration()) {
      this.requestTimeSlotError += "Duration Required; ";
      hasError = true;
    }
    if(hasError) {
      return;
    }
    this.calAdminService.genericGet(this.getTimeslotUrl()).subscribe(resp => {
      let json = JSON.stringify(resp, null, 2);
      console.log(json);
      let error: ApiError = JSON.parse(json);
      if(error.status == null || error.status == undefined) {
        let result =  "\n" + json as string;
        const dialogRef = this.dialog.open(ContentDialogComponent, {
          width: '500px',
          height: '500px',
          data: result,
        });
      } else {
        this.requestTimeSlotError = error.message;
      }
     },
     error => {
      this.requestTimeSlotError = Util.handleError(error);
     }
     );
  }

}

class CalInfoRequest {
  calId: string | undefined;
  year: number | undefined;

  min = new Date().getFullYear();
  max = this.min + 20;
}

class TimeSlotRequest {
  calId: string | undefined;

  timezoneId: string | undefined;
  sinceDateTime: string | undefined;

  day: number| undefined;
  hour: number| undefined;
  minute: number| undefined;

  getDuration() : string | undefined{
    let duration = "";
    if(this.day) {
      duration += "d" + this.day;
    } 
    if(this.hour) {
      duration += "h" + this.hour;
    } 
    if(this.minute) {
      duration += "m" + this.minute;
    } 
    if(duration.trim() == "") {
      return undefined;
    }
    return duration;
  }

}
