import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'cal-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
  }

  logout(e:Event){
    this.authService.logout ();
    this.router.navigate(["../login"]);
  }

}
