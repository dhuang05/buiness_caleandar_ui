import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//
import { HttpService } from './service/http.service';
//
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';
import { mainRouting } from './app.routing';
import { AuthGuard } from './auth-guard';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CalAdminModule } from './cal-admin/cal-admin.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,    
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    mainRouting,
    BrowserAnimationsModule,
    CalAdminModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    HttpService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
