import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//
import { HttpService } from './service/http.service';

//
import { AppComponent } from './app.component';
import { CalAdminComponent } from './cal-admin/cal-admin.component';
import { AuthModule } from './auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';
import { mainRouting } from './app.routing';
import { AuthGuard } from './auth-guard';

@NgModule({
  declarations: [
    AppComponent,
    CalAdminComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,    
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    mainRouting,
  ],
  providers: [
    HttpService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
