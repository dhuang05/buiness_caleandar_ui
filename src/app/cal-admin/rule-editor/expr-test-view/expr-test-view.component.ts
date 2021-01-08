import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CalErr } from 'src/app/common/common-model';
import { RuleEditData, RuleExprTestResult } from 'src/app/model/cal-model';


@Component({
  selector: 'cal-expr-test-view',
  templateUrl: './expr-test-view.component.html',
  styleUrls: ['./expr-test-view.component.scss']
})
export class ExprTestViewComponent implements OnInit {
  @Input() exprTestResult: RuleExprTestResult | undefined;

  constructor(){
  }

  ngOnInit() {
    
  }

  hasDates () {
    return this.exprTestResult?.ruleDates != undefined &&  this.exprTestResult?.ruleDates.length > 0;
  }
}