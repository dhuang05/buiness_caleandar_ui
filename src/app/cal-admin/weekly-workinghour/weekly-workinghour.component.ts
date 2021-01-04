/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, BusinessHour } from 'src/app/model/cal-model';
import { CalErr } from 'src/app/common/common-model';



@Component({
  selector: 'cal-weekly-workinghour',
  templateUrl: './weekly-workinghour.component.html',
  styleUrls: [ './weekly-workinghour.component.scss' ]
})
export class WeeklyWorkingHourComponent implements OnInit {
  errorInfo: CalErr| undefined;
  @Input() businessHour: BusinessHour| undefined;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute){
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
  }

  checkValue() {
    this.errorInfo = undefined;
    let errorMsgs: string[] = [];
    if(!this.isEmpty(this.businessHour?.businessHourFrom) || !this.isEmpty(this.businessHour?.businessHourTo)) {
        if(this.isEmpty(this.businessHour?.businessHourFrom)) {
          errorMsgs.push("Start time");
        }
        if(this.isEmpty(this.businessHour?.businessHourTo)) {
          errorMsgs.push("End time");
        }
        if(errorMsgs.length > 0) {
          let errorInfo = new CalErr();
          errorInfo.errMsgs = errorMsgs;
          errorInfo.title = "Required:";
          this.errorInfo = errorInfo;
          this.errorInfo.note = "Both empty means not working";
        }
    }
  }
  
  delete(){
    if(this.businessHour) {
      this.businessHour.businessHourFrom = "";
      this.businessHour.businessHourTo = "";
    }
  }

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }

  
}
