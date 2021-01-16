import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from 'src/app/common/info-dialog/info-dialog.component';
import { Util } from 'src/app/common/util';
import { ApiError, Contact, Organization, Person, Role, User, UserInfo } from 'src/app/model/cal-model';


@Component({
  selector: 'cal-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  hasLogedIn: boolean = false;
  isUserHasSuperRole: boolean = false;
  hasTrialRole = false;
  hasAdmin = false;
  userInfoSubscription: any;
  step = 0;
  //
  organizationMessage: string = "";
  userMessage: string = "";
  isNewUser: boolean = false;
  dialogRef: any;

//
  organizations: Organization[] | undefined;
  users: User[] | undefined; 
  organization: Organization | undefined;
  user: User | undefined;
  userRoles: string[] = [];
//

  organizationNameToSearch = "";
  userNameToSearch = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
  }


  ngOnInit() {
    this.isUserHasSuperRole =  this.authService.hasSupperRole();
    this.hasTrialRole = this.authService.hasTrialRole();
    this.hasAdmin = this.authService.hasAdminRoles();
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
          this.isUserHasSuperRole =  this.authService.hasSupperRole();
          this.hasTrialRole = this.authService.hasTrialRole();
          this.hasAdmin = this.authService.hasAdminRoles();
        }else {
          this.hasLogedIn = false;
          this.isUserHasSuperRole =  false;
          this.hasAdmin  = false;
        }
      });
      this.findOrganizations ();
  }

  ngOnDestroy(){
    if(this.userInfoSubscription != null) {
      this.userInfoSubscription.unsubscribe();
    }
  }

findOrganizations () {
  this.authService.findOrganizations(this.authService.getUserInfo().user.userId, "")
      .subscribe(resp => {
        let json = JSON.stringify(resp);
        console.log("json: " + json);
        let error: ApiError = JSON.parse(json);
        if(!ApiError.isError(error)) {
            this.organizations = JSON.parse(json) as Organization[];
        } else {
          this.organizationMessage = error.errMessage;
        }
       },
       error => {
        this.organizationMessage = Util.handleError(error);
      });
}

findUsers () {
  this.userMessage = "";
  this.authService.findUsers(this.authService.getUserInfo().user.orgId, "")
      .subscribe(resp => {
        let json = JSON.stringify(resp);
        console.log("json: " + json);
        let error: ApiError = JSON.parse(json);
        if(!ApiError.isError(error)) {
            this.users = JSON.parse(json) as User[];
        } else {
          this.userMessage = error.errMessage;
        }
       },
       error => {
        this.userMessage = Util.handleError(error);
      });
}

  isEditItself(): boolean {
    return this.user?.userId === this.authService.getUserInfo().user.userId;
  }

  logout(e:Event) {
    this.authService.logout ( this.authService.getUserInfo().user.userId);
    this.router.navigate(["../login"]);
  }

  setNewOrg() {
    this.setCurrentOrg(new Organization());
  }

  setCurrentOrg(org : Organization) {
    this.organizationMessage = "";
    if(Util.isEmpty(org.orgId) && (!Util.isEmpty(this.organization) && Util.isEmpty(this.organization?.orgId))) {
      return;
    }
    this.organization = org;
    this.prepareOrganization();
  }


  prepareOrganization() {
    if(!this.organization) {
      this.organization = this.createOrganizationObj();
    } 
    if(!this.organization.firstContactPerson) {
      this.organization.firstContactPerson = new Person();
    }
    if(!this.organization.firstContactPerson.contact) {
      this.organization.firstContactPerson.contact = new Contact();
    }
  }

  isEmpty(data: string | undefined | any) : boolean{
    return Util.isEmpty(data);
  }

  saveOrganization() {
    let error = false;
    this.organizationMessage = "\n";
    if(!this.organization) {
      this.organizationMessage = "Not Organization object;\n";
      error = true;
      return;
    } 
    let organization: Organization = this.organization;
    if(!organization) {
      this.organizationMessage = "Not Organization object;\n";
      error = true;
    } else {
      if(Util.isEmpty(organization.orgName)){
        error = true;
      }
      if(Util.isEmpty(organization.address)){
        error = true;
      }
      if(! organization.firstContactPerson) {
        error = true;
      } else {
        if(Util.isEmpty(organization.firstContactPerson?.firstName)) {
          error = true;
        }
        if(Util.isEmpty(organization.firstContactPerson?.lastName)) {
          error = true;
        }
        if(Util.isEmpty(organization.firstContactPerson?.contact)) {
          error = true;
        } else  if (Util.isEmpty(organization.firstContactPerson?.contact.email)) {
          error = true;
        }
      }
    }
    if(error) {
      this.organizationMessage = "Please input required fields;";
      return;
    }

    if(this.hasTrialRole) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '250px',
        height: '180px',
        data: "Not authorize trial user to save data."
      });
      return;
    }

    this.authService.saveOrganization(organization)
    .subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("json: " + json);
      let error: ApiError = JSON.parse(json);
      if(!ApiError.isError(error)) {
        let organization: Organization = JSON.parse(json);
        if(!this.organizations) {
          this.organizations = [];
        }
        let found = false;
        for(let i=0; i<this.organizations.length; i++) {
          if(Util.isEqual(this.organizations[i].orgId, organization.orgId)) {
            this.organizations[i] = organization;
            found = true;
          }
        }
        if(! found ){
          this.organizations.push(organization);
        }
        this.organization = organization;
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '250px',
          height: '180px',
          data: "Organization saved."
        });
      } else {
        this.organizationMessage = error.errMessage;
      }
     },
     error => {
      this.organizationMessage = Util.handleError(error);
    });

  }

  searchOrganizations() {
    this.organizationMessage = "\n";
      if(Util.isEmpty(this.organizationNameToSearch) || this.organizationNameToSearch.replace("*", "").trim().length < 2) {
        this.organizationMessage = "At least 2 charaters to search.";
      }
      let userId = "";
      if(!this.isUserHasSuperRole) {
        userId = this.authService.getUserInfo().user.userId;
      }
      this.authService.findOrganizations("", this.organizationNameToSearch)
      .subscribe(resp => {
        let json = JSON.stringify(resp);
        console.log("json: " + json);
        let error: ApiError = JSON.parse(json);
        if(!ApiError.isError(error)) {
            this.organizations = JSON.parse(json) as Organization[];
        } else {
          this.organizationMessage = error.errMessage;
        }
       },
       error => {
        this.organizationMessage = Util.handleError(error);
      });
  }

  setNewUser() {
    this.userMessage = "\n";
    if(!this.organization || Util.isEmpty(this.organization.orgId)) {
      this.userMessage = "Please select a existing organization to add user"; 
      return;
    }
    let user = new User();
    user.orgId = this.organization.orgId as string;
    this.setCurrentUser(user);
  }

  setCurrentUser(user : User) {
    this.isNewUser = false;
    if (Util.isEmpty(user.userId)){
      this.isNewUser = true;
    }
    this.userMessage = "";
    this.user = user;
    this.prepareUser();
  }


  prepareUser() {
    this.userRoles = [];
    if(!this.user) {
      this.user = this.createUserObj();
    } 
    if(this.user.roles) {
      for(let role of this.user.roles) {
        if(!Util.isEmpty(role.roleId)) {
          this.userRoles.push(role.roleId);
        }
      }
    }
    if(!this.user.person) {
      this.user.person = new Person();
    }
    if(!this.user.person.contact) {
      this.user.person.contact = new Contact();
    }
    if(Util.isEmpty(this.user.orgId) && !Util.isEmpty(this.organization?.orgId)) {
      this.user.orgId = this.organization?.orgId as string;
    }
  }

  saveUser() {
    this.userMessage = "\n";
    let error = false;
    if(!this.user) {
      this.userMessage = "Not User object;\n";
      error = true;
      return;
    }
    let user: User = this.user;
    if(!user) {
      this.userMessage = "Not User object;\n";
      error = true;
      return;
    } else{
      if(Util.isEmpty(user.userId)) {
        error = true;
      }
      if(Util.isEmpty(user.orgId)) {
        error = true;
      }
      if(!user.person) {
        error = true;
      } else {
        if(Util.isEmpty(user.person.firstName)) {
          error = true;
        }
        if(Util.isEmpty(user.person.lastName)) {
          error = true;
        }
        if(Util.isEmpty(user.person.contact)) {
          error = true;
        } else {
          if(Util.isEmpty(user.person.contact.email)) {
            error = true;
          }
        }
      }
  
      if(!this.userRoles || this.userRoles.length === 0) {
        error = true;
      } else {
        this.user.roles = [];
        for(let roleName of this.userRoles) {
          let role = new Role();
          role.roleId = roleName;
          this.user.roles.push(role);
        }
      }
    }
    if(error) {
      this.userMessage = "Please check required fields;\n";
      return;
    }

    if(this.hasTrialRole) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '250px',
        height: '180px',
        data: "Not authorize trial user to save data."
      });
      return;
    }

    this.authService.saveUser(this.user)
    .subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("json: " + json);
      let error: ApiError = JSON.parse(json);
      if(!ApiError.isError(error)) {
        let user: User = JSON.parse(json);
        if(!this.users) {
          this.users = [];
        }
        let found = false;
        for(let i=0; i<this.users.length; i++) {
          if(Util.isEqual(this.users[i].userId, user.userId)) {
            this.users[i] = user;
            found = true;
          }
        }
        if(! found ){
          this.users.push(user);
        }
        this.user = user;
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '250px',
          height: '180px',
          data: "User saved."
        });
      } else {
        this.userMessage = error.errMessage;
        this.user = user;
      }
     },
     error => {
      this.userMessage = Util.handleError(error);
    });

  }

  

  isPasswordRequired(): boolean {
    return !Util.isEmpty(this.user) && this.isNewUser && Util.isEmpty(this.user?.password);
  }

  passwordLabel(): string {
    if(this.isNewUser) {
        return "Temporary Password";
    }
    return "New password (if want to change)";
  }

  addEditUser(org: Organization) {
    if(this.organization && !Util.isEqual(org.orgId, this.organization.orgId)) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '320px',
        height: '210px',
        data: "An organization is under edit, are sure to move away?"
      });
  
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
         if(result == true) {
          this.dialogRef.close();
          this.organization = org;
          this.setStep(1);
         }
      });
    }
    //this.organization = org;
    //this.setStep(1);
  }

  userIdValidate() {
    if(this.user && this.user.userId) {
      this.user.userId = this.user.userId.replace(/\s/g, "");
    }
  }

  searchUsers() {
    this.userMessage = "\n";
      if(Util.isEmpty(this.userNameToSearch) || this.userNameToSearch.replace("*", "").trim().length < 2) {
        this.userMessage = "At least 2 charaters to search."
      }
      let orgId = "";
      if(!this.isUserHasSuperRole && this.organization?.orgId) {
        orgId = this.organization?.orgId as string;
      }
      this.authService.findUsers(orgId, this.userNameToSearch)
    .subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("json: " + json);
      let error: ApiError = JSON.parse(json);
      if(!ApiError.isError(error)) {
          this.users = JSON.parse(json) as User[];
      } else {
        this.userMessage = error.errMessage;
      }
     },
     error => {
      this.userMessage = Util.handleError(error);
    });
  }

  setStep(step : number) {
    this.step = step;
  }

  private createOrganizationObj () : Organization{
    let organization = new Organization();
    organization.orgName = "";
    let person = new Person();
    organization.firstContactPerson = person;
    let contact = new Contact();
    person.contact = contact;
    return organization;
  }

  private createUserObj () : User{
    let user = new User();
    let person = new Person();
    //
    user.roles = [];
    let contact = new Contact();
    person.contact = contact;
    return user;
  }
}
