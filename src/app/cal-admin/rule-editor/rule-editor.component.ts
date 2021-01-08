import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CalErr } from 'src/app/common/common-model';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { RuleEditData, RuleExpr, RuleExprTestResult } from 'src/app/model/cal-model';
import { CalAdminService } from '../services/cal_admin.service';

@Component({
  selector: 'cal-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnInit {
  exprTestResult: RuleExprTestResult | undefined;
  canSave = false;
  @Output() testEvent = new EventEmitter<boolean>();
  selectedYear: number;
  years:number[] ;

  oringinalExpr: string; 

  constructor(
    private router: Router,
    private calAdminService: CalAdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RuleEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleEditData)
    {
      this.oringinalExpr = data.expression;
      let date = new Date();
      this.selectedYear = date.getFullYear();
      this.years = [];
      for(let i =0; i< 10; i++) {
        this.years.push(this.selectedYear + i);
      }
  }

  ngOnInit() {
  }

  isEdited(): boolean {
    let orgEnpty = this.isEmpty(this.oringinalExpr);
    let newEmpty = this.isEmpty(this.data.expression);
    if(orgEnpty && newEmpty) {
      return false;

    } else if ((!orgEnpty && newEmpty) || (orgEnpty && !newEmpty) ) {
      return true;

    } else if(this.oringinalExpr.trim() != this.data.expression.trim()) {
      return true;
      
    } else {
      return false;
    }
  }

  testRule() {
    let ruleExpr = new RuleExpr();
    ruleExpr.expr = this.data.expression;
    ruleExpr.name = this.data.title;
    this.calAdminService.testCalendarRuleExpr(ruleExpr, this.selectedYear).subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("json: " + json);
      this.exprTestResult = JSON.parse(json);
      if(this.exprTestResult?.success) {
        this.canSave = true;
      }
     });
  }

  cancel() {
    if(this.canSave && this.isEdited()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        height: '200px',
        data: "The rule expression has been edited, Are you sure to cancel without update?"
      });
  
      dialogRef.afterClosed().subscribe(result => {
         if(result == true) {
          this.dialogRef.close();
         }
      });
    } else {
      this.dialogRef.close();
    }
  }

  saveRule() {
    if(this.exprTestResult != undefined && this.exprTestResult.success) {
      this.dialogRef.close(this.data);
    }
  }

  changeExpr(e: Event) {
    this.canSave = false;
  }

  isEmpty(text: string| undefined): boolean{
    return text == null || text == undefined || text.trim().length == 0;
  }
}