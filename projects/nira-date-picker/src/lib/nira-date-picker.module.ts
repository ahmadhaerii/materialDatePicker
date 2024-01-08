import { NgModule } from '@angular/core';
import { NiraDatePickerComponent } from './nira-date-picker.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerDialogComponent } from './date-picker-dialog/date-picker-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { MonthDialogComponent } from './month-dialog/month-dialog.component';


@NgModule({
  declarations: [NiraDatePickerComponent, DatePickerDialogComponent, MonthDialogComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,

  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],
  exports: [NiraDatePickerComponent],
})
export class NiraDatePickerModule {}
