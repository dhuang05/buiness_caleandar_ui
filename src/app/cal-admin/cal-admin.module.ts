/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */

import { NgModule } from '@angular/core';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth-guard';
import { CalAdminComponent } from './cal-admin.component';
import { WeeklyWorkingHourComponent } from './weekly-workinghour/weekly-workinghour.component';
import { AuthService } from '../auth/services/auth.service';
import { CalAdminService } from './services/cal_admin.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon'
import { TextFieldModule } from '@angular/cdk/text-field';
import { SpecialWorkingHourComponent } from './special-workinghour/special-workinghour.component';
import { HoldayDefinitionComponent } from './holiday-definition/holiday-definition.component';
import { CalErr } from '../common/common-model';
import { ErrorComponent } from '../common/error/error.component';
import { LogoutComponent } from '../auth/logout/logout.component';
import { AuthModule } from '../auth/auth.module';
import { RuleEditorComponent } from './rule-editor/rule-editor.component';
import { RuleEditorHelpComponent } from './rule-editor/help/help.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ExprTestViewComponent } from './rule-editor/expr-test-view/expr-test-view.component';

@NgModule({
        declarations: [
            CalAdminComponent,
            WeeklyWorkingHourComponent,
            SpecialWorkingHourComponent,
            HoldayDefinitionComponent,
            ErrorComponent,
            RuleEditorComponent,
            RuleEditorHelpComponent,
            ExprTestViewComponent,
        ],
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule,
            MatSelectModule,
            MatInputModule,
            MatIconModule,
            TextFieldModule,
            AuthModule,
            MatTabsModule,
        ],
        providers: [
            CalAdminService,
            AuthService
        ],
        exports: [
            
        ]
    }
)

export class CalAdminModule {}
