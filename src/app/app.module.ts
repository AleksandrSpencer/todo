import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoriesComponent } from './views/categories/categories.component';
import { TasksComponent } from './views/tasks/tasks.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import { EditTaskDialogComponent } from './dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { TaskDatePipe } from './pipe/task-date.pipe';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { EditCategoryDialogComponent } from './dialog/edit-category-dialog/edit-category-dialog.component';
import { FooterComponent } from './views/footer/footer.component';
import { AboutDialogComponent } from './dialog/about/about-dialog.component';
import { HeaderComponent } from './views/header/header.component';
import { StatComponent } from './views/stat/stat.component';
import { StatCardComponent } from './views/stat/stat-card/stat-card.component';
import {ColorPickerModule} from "ngx-color-picker";
import { PrioritiesComponent } from './views/priorities/priorities.component';
import { SettingsDialogComponent } from './dialog/settings-dialog/settings-dialog.component';
import { EditPriorityDialogComponent } from './dialog/edit-priority-dialog/edit-priority-dialog.component';
import {SidebarModule} from "ng-sidebar";

registerLocaleData(localeRu);


@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent,
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    TaskDatePipe,
    EditCategoryDialogComponent,
    FooterComponent,
    AboutDialogComponent,
    HeaderComponent,
    StatComponent,
    StatCardComponent,
    PrioritiesComponent,
    SettingsDialogComponent,
    EditPriorityDialogComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ColorPickerModule,
    SidebarModule.forRoot()
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'ru-Ru' }   ],
  entryComponents: [
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    EditCategoryDialogComponent,
    AboutDialogComponent,
    SettingsDialogComponent,
    EditPriorityDialogComponent

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
