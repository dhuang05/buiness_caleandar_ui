/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'cal-cal-admin',
  templateUrl: './cal-admin.component.html',
  styleUrls: [ './cal-admin.component.scss' ]
})
export class CalAdminComponent implements OnInit {
  message: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
    if(this.authService == undefined) {
      this.router.navigate(['login']);
    }
  }
  
}
