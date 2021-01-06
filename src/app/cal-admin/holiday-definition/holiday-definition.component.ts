/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, BusinessHour, DayRule, RuleEditData } from 'src/app/model/cal-model';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { CalErr } from 'src/app/common/common-model';
import { MatDialog } from '@angular/material/dialog';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';



@Component({
  selector: 'cal-holiday-definition',
  templateUrl: './holiday-definition.component.html',
  styleUrls: [ './holiday-definition.component.scss' ]
})
export class HoldayDefinitionComponent implements OnInit {
  errorInfo: CalErr| undefined;
  @Input() holidayRule: DayRule | undefined;
  passedTest: boolean = true;
  @Output() deleteEvent = new EventEmitter<DayRule>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
    this.checkValue();
  }

  checkValue() {
    this.errorInfo = undefined;

    let messages: string[] = [];
    if(this.isEmpty(this.holidayRule?.desc)) {
      messages.push("Holiday Name");
    }
    if(this.isEmpty(this.holidayRule?.expr)) {
      messages.push(" Rule expression");
    }
    if(messages.length > 0) {
      let errorInfo = new CalErr();
      errorInfo.errMsgs = messages;
      errorInfo.title = "Required:";
      this.errorInfo = errorInfo;
    }
  }
  
  openEditor() : void {
    const dialogRef = this.dialog.open(RuleEditorComponent, {
      width: '1000px',
      height: '600px',
      data: new RuleEditData(this.holidayRule?.expr as string, this.holidayRule?.desc as string)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The editor was closed');
      let data: RuleEditData = result;
      if(data && this.holidayRule?.expr) {
        this.holidayRule.expr = data.expression;
        // handle error not pass test
      }
    });
}

  delete(){
    this.deleteEvent.emit(this.holidayRule);
  }

  deleteExpiryDate() {
    if(this.holidayRule) {
      this.holidayRule.expiredDate = undefined
    }

  }
  deleteEffectiveDate() {
    if(this.holidayRule) {
      this.holidayRule.effectiveDate = undefined
    }
  }

  test(){
    
  }

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }

  
}