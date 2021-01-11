import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Util } from 'src/app/common/util';

@Component({
  selector: 'cal-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  @Input() currentPageName: string = "";
  public static CAL_ADMIN = "CAL_ADMIN";
  public static RESET_PASSWORD = "RESET_PASSWORD";
  public static API = "API";
  public static USER_ADMIN = "USER_ADMIN";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService){
  }

  ngOnInit() {
   
  }

  isMyPage(myPageName: string){
    return Util.isEqual(this.currentPageName, myPageName);
  }

  gotToResetPassword(){
    if(this.authService.getUserInfo() != undefined) {
      this.router.dispose();
      this.router.navigate(['resetpassword']);
    }
  }
  

  gotToCalAdmin(){
    this.router.dispose();
    this.router.navigate(['cal-admin']);
  }


  gotToApis(){
    this.router.dispose();
    this.router.navigate(['apis']);
  }

  gotToUserAdmin(){
    //this.router.navigate(['user_admin']);
    //this.router.navigate(["../user_admin"]);
  }


}

