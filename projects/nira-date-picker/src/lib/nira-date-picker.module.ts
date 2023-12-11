import { NgModule } from '@angular/core';
import { NiraDatePickerComponent } from './nira-date-picker.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [NiraDatePickerComponent],
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
  ],
  exports: [NiraDatePickerComponent],
})
export class NiraDatePickerModule {}
