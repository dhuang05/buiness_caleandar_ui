import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from 'src/app/model/cal-model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'cal-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {
  hasLogedIn: boolean = false;
  userInfoSubscription: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {});
    if(this.authService.hasUser()) {
        this.hasLogedIn = true;
      }else {
        this.hasLogedIn = false;
    }
    this.userInfoSubscription = this.authService.getUserInfoEventEmitter()
      .subscribe((userInfo: UserInfo) => {
        if(userInfo != undefined && userInfo.user != undefined) {
          this.hasLogedIn = true;
        }else {
          this.hasLogedIn = false;
        }
      }
      );
  }

  ngOnDestroy(){
    if(this.userInfoSubscription != null) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  logout(e:Event){
    this.authService.logout ( this.authService.getUserInfo().user.userId);
    this.router.navigate(["../login"]);
  }

  
}
