import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CalErr } from 'src/app/common/common-model';
import { CalAdminService } from '../services/cal_admin.service';


@Component({
  selector: 'cal-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnInit {
  errorInfo: CalErr| undefined;
  
  constructor(
    private router: Router,
    private calAdminService: CalAdminService,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
  }

}
