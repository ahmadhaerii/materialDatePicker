import { Component, OnInit } from '@angular/core';
import {
  Month,
  NiraDatePickerService,
  Season,
} from '../nira-date-picker.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-month-dialog',
  templateUrl: './month-dialog.component.html',
  styleUrl: './month-dialog.component.css',
})
export class MonthDialogComponent implements OnInit {
  seasons: Season[] = [] as Season[];
  constructor(
    private niraService: NiraDatePickerService,
    private MonthDialogRef: MatDialogRef<MonthDialogComponent>
  ) {}
  ngOnInit(): void {
    this.seasons = this.niraService.getSeasons;
  }
  onSetMonth(month: Month) {
    console.log(month);

    this.MonthDialogRef.close(month ? month : undefined);
  }
}
