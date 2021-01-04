/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, BusinessHour } from 'src/app/model/cal-model';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { CalErr } from 'src/app/common/common-model';



@Component({
  selector: 'cal-special-workinghour',
  templateUrl: './special-workinghour.component.html',
  styleUrls: [ './special-workinghour.component.scss' ]
})
export class SpecialWorkingHourComponent implements OnInit {
  errorInfo: CalErr| undefined;
  @Input() businessHour: BusinessHour | undefined;
  @Output() deleteEvent = new EventEmitter<BusinessHour>();

  constructor(
    private router: Router,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
    this.checkValue();
  }

  checkValue() {
    this.errorInfo = undefined;
    let errorMsgs: string[] = [];
    if(this.isEmpty(this.businessHour?.businessHourFrom)) {
      errorMsgs.push("Start time");
    }
    if(this.isEmpty(this.businessHour?.businessHourTo)) {
      errorMsgs.push("End time");
    }
    if(this.isEmpty(this.businessHour?.dayExpr)) {
      errorMsgs.push("Rule expression");
    }
    if(errorMsgs.length > 0) {
      let errorInfo = new CalErr();
      errorInfo.errMsgs = errorMsgs;
      errorInfo.title = "Required:";
      this.errorInfo = errorInfo;
    }
  }
  
  delete(){
    this.deleteEvent.emit(this.businessHour);
  }

  test(){
    
  }

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }

  
}
