/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, BusinessHour, RuleEditData } from 'src/app/model/cal-model';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { CalErr } from 'src/app/common/common-model';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'cal-special-workinghour',
  templateUrl: './special-workinghour.component.html',
  styleUrls: [ './special-workinghour.component.scss' ]
})
export class SpecialWorkingHourComponent implements OnInit {
  errorInfo: CalErr| undefined;
  passedTest: boolean = true;
  @Input() businessHour: BusinessHour | undefined;
  @Output() deleteEvent = new EventEmitter<BusinessHour>();

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

  openEditor() : void {
      const dialogRef = this.dialog.open(RuleEditorComponent, {
        width: '1000px',
        height: '600px',
        data: new RuleEditData(this.businessHour?.dayExpr as string, this.businessHour?.desc as string)
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The editor was closed');
        let data: RuleEditData = result;
        if(data && this.businessHour) {
          this.businessHour.dayExpr = data.expression;
          // handle error not pass test
        }
      });
  }

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }

  
}
