/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginForm } from '../auth/model/cal-model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'cal-admin',
  templateUrl: './admin.component.html',
  styleUrls: [ './admin.component.scss' ]
})
export class CalAdminComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    if(this.authService == undefined) {
      this.router.navigate(["../auth/login"]);
    }
  }
  
}
