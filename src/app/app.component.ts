import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  datePickerFrmGrp: FormGroup = {} as FormGroup;
  isOpen: boolean = false;
  title = 'test-lib';

  constructor() {}

  ngOnInit(): void {
    this.datePickerFrmGrp = new FormGroup({
      datePickerFrmCtrl: new FormControl(null, Validators.required),
    });
  }

  onShowCalendar() {
    this.isOpen = true;
  }
  getDefaultDate() {
    const defaultDate = this.datePickerFrmGrp.get('datePickerFrmCtrl')?.value;
    return defaultDate;
  }

  getCalenderResult(result: string) {
    this.datePickerFrmGrp.setValue({
      datePickerFrmCtrl: result,
    });
  }
}
