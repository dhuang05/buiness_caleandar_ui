import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CalErr } from 'src/app/common/common-model';
import { RuleEditData } from 'src/app/model/cal-model';
import { CalAdminService } from '../services/cal_admin.service';

@Component({
  selector: 'cal-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnInit {
  errorInfo: CalErr| undefined;
  @Output() testEvent = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private calAdminService: CalAdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<RuleEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleEditData){
  }

  ngOnInit() {
  }

  testRule() {

  }

  cancel() {
    this.dialogRef.close();
  }

  testAndExit() {
    this.testRule();
    this.dialogRef.close(this.data);
  }

  closeOnly() {
    this.dialogRef.close(this.data);
  }

}