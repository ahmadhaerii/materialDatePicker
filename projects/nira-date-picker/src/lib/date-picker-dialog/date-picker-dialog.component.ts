import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import moment from 'jalali-moment';
import {
  DatePickerDialogInputData,
  Month,
  NiraDatePickerService,
  Theme,
} from '../nira-date-picker.service';
import { DatePickerResult } from '../nira-date-picker.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MonthDialogComponent } from '../month-dialog/month-dialog.component';

@Component({
  selector: 'lib-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrl: './date-picker-dialog.component.css',
})
export class DatePickerDialogComponent implements OnInit, OnDestroy {
  @Input() bestFares: { Departure: ''; TotalPrice: '' }[] = [
    { Departure: '', TotalPrice: '' },
  ];
  @ViewChild('yearDialog') yearDialog: any;
  primaryColor: string = 'red';
  theme: Theme = {} as Theme;
  testColor: string = 'red';
  public month!: number;
  days: number[] = [];
  public calendarType = '';
  public m = moment();
  year!: number;
  public date: Date = new Date();
  result: string = '';
  selectedDay?: number;
  isChangeCalenderType: boolean = false;
  public yearSelectorVisible = false;
  decadeDialogRef: any;
  defaultDate?: number;
  isToday: boolean = false;
  isHoverToday: boolean = false;
  isHoverCalenderType: boolean = false;
  isHoverBackArrowIcon: boolean = false;
  isHoverNextArrowIcon: boolean = false;

  public months: string[] = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  currentShamsiDay: number = 0;
  value: string = '';
  loadingPrice: boolean = false;
  datePickerSub?: Subscription;
  yearFrmGrp: FormGroup = {} as FormGroup;
  inputYearDialog: any;
  constructor(
    public datePickerDialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatePickerDialogInputData,
    private niraService: NiraDatePickerService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.currentShamsiDay = this.m.jDate();
    this.yearFrmGrp = new FormGroup({
      yearFrmCtrl: new FormControl(null, Validators.required),
    });
    this.setDefaultValues();
  }

  public getCurrentDayShamsi(): Number {
    let day = this.niraService.getShamsiDay();
    return day;
  }
  updateYearInDatePicker() {
    if (this.yearFrmGrp.get('yearFrmCtrl')?.valid) {
      this.year = this.yearFrmGrp.get('yearFrmCtrl')?.value;
      this.updateDays();
      this.inputYearDialog.close();
    }
  }
  goBeforeMonth() {
    if (this.month > 0) {
      this.month--;
    }
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    }
    this.updateDays();
  }
  goAfterMonth() {
    if (this.month < 11) {
      this.month++;
      this.updateDays();
    } else if (this.month === 11) {
      this.month = 0;
      this.year++;
    }
  }
  updateDays() {
    this.days = [];
    let Jstr = this.year + '/' + (this.month + 1).toString() + '/' + '01';

    let Jdate = moment(Jstr, 'jYYYY/jM/jD');
    const days = Jdate.jDaysInMonth();
    const day = Jdate.jDay();
    for (let i = 0; i < day; i++) {
      this.days.push(0);
    }
    for (let i = 1; i <= days; i++) {
      this.days.push(i);
    }
  }
  selectDay(day: number, type: string) {
    try {
      const currentShamsiDay = Number(this.getCurrentDayShamsi());
      if (day != 0) {
        const pad = (s: any) => (s.length < 2 ? 0 + s : s);
        this.date = new Date(this.year, this.month, day);

        if (!this.data.disable) {
          this.result = `${this.year}-${pad(this.month + 1 + '')}-${pad(
            day + ''
          )}`;
        } else {
          this.result = '';
        }

        let datePickerResult: DatePickerResult = {
          result: this.result,
          isChangeCalenderType: false,
          isToday: this.isToday,
        };
        if (type !== 'today') this.datePickerDialogRef.close(datePickerResult);
      }
    } catch (err) {}
  }

  public updateMonth(e?: Event, type?: string) {
    if (e) e.stopPropagation();

    if (type === 'dec') {
      this.month--;
      this.days = [];
    }

    if (type === 'inc') {
      this.month++;
      this.days = [];
    }

    if (type === 'today') {
      if (this.calendarType === 'fa') {
        this.m = moment();

        this.month = this.m.jMonth();

        this.year = this.m.jYear();

        this.selectDay(this.m.jDate(), 'today');
        this.days = [];
      } else {
        this.month = new Date().getMonth();
        this.year = new Date().getFullYear();
        let currentDate = new Date().getDate();
        this.selectDay(currentDate, 'today');
        this.days = [];
      }
    }

    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }

    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }

    if (this.calendarType == 'en') {
      let date = new Date(this.year, this.month, 0);
      const days = date.getDate();
      const day = new Date(this.year, this.month, 1).getDay();

      for (let i = 1; i < day; i++) this.days.push(0);

      for (let i = 1; i <= days; i++) this.days.push(i);
    } else if (this.calendarType == 'fa') {
      let Jstr = this.year + '/' + (this.month + 1).toString() + '/' + '01';
      let Jdate = moment(Jstr, 'jYYYY/jM/jD');
      const days = Jdate.jDaysInMonth();
      const day = Jdate.jDay();
      for (let i = 0; i < day; i++) {
        this.days.push(0);
      }

      for (let i = 1; i <= days; i++) {
        if (this.bestFares != undefined) this.days.push(i);
        else this.days.push(i);
      }
    }
  }
  goToToday() {
    this.niraService.isTodaySubj.next(true);
    this.days = [];
    this.isToday = true;

    const currentDate = this.m.jDate();
    const currentMonth = this.m.jMonth();
    const currentYear = this.m.jYear();
    let Jstr = currentYear + '/' + (currentMonth + 1).toString() + '/' + '01';
    let Jdate = moment(Jstr, 'jYYYY/jM/jD');
    const days = Jdate.jDaysInMonth();
    const day = Jdate.jDay();
    for (let i = 0; i < day; i++) {
      this.days.push(0);
    }
    for (let i = 1; i <= days; i++) {
      this.days.push(i);
    }
    this.year = currentYear;
    this.month = currentMonth;
    this.defaultDate = currentDate;
  }

  public getSelectedDay(day: number): boolean {
    const currentDay = this.m.jDate();
    const currentMonth = this.m.jMonth();
    const currentYear = this.m.jYear();
    if (this.data.defaultDate) {
      if (this.isToday) {
        this.defaultDate = currentDay;
      } else {
        this.defaultDate = +this.data.defaultDate.substring(8);
      }
      if (
        this.defaultDate == day &&
        this.month == currentMonth &&
        this.year == currentYear
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getCurrentDate(day: number): boolean {
    const currentDate = this.m.jDate();
    const currentYear = this.m.jYear();
    const currentMonth = this.m.jMonth();

    if (
      day == currentDate &&
      this.month == currentMonth &&
      this.year == currentYear
    ) {
      return true;
    } else {
      return false;
    }
  }

  activeDay(day: string) {
    let today;
    let currentMonth;
    let currentYear = 0;

    if (this.calendarType == 'en') {
      let dt = new Date();
      today = dt.getDate();
      currentMonth = dt.getMonth();
    } else {
      this.m = moment();
      today = this.m.jDate();
      currentMonth = this.m.jMonth();
      currentYear = this.m.jYear();
    }

    if (
      (Number(day) <= today &&
        this.month == currentMonth &&
        this.year == currentYear) ||
      (this.month < currentMonth && this.year == currentYear) ||
      this.year < currentYear
    )
      return false;
    else return true;
  }
  public setDefaultValues() {
    let strdefaultDate: string = this.data.defaultDate;

    if (strdefaultDate != undefined && strdefaultDate.length > 8) {
      let dateParts: string[] = this.data.defaultDate.split('-');
      let strYear = dateParts[0];
      let year = new Number(strYear);
      this.value = this.data.defaultDate;
      if (+year > 1500) {
        this.value = new Date(this.value).toLocaleDateString();
        this.calendarType = 'en';
      } else {
        this.niraService.setShamsiDateStr(this.value);
        let miladiStr = this.niraService.getMiladiDateStr();
        this.m = moment(miladiStr);
        this.calendarType = 'fa';
      }
    } else {
      if (this.calendarType.length < 2) this.calendarType = 'fa';
      if (this.calendarType == 'en')
        this.value = new Date().toLocaleDateString();
      else {
        this.calendarType = 'fa';
        this.m = moment();
        this.value = this.m.locale('fa').format('jYYYY/jMM/jDD');
      }
    }
    if (this.calendarType == 'en') {
      if (this.value) this.date = new Date(this.value);
      this.month = this.date.getMonth();
      this.year = this.date.getFullYear();
      if (this.value) this.selectDay(this.date.getDate(), 'today');
    } else if (this.calendarType === 'fa') {
      this.month = this.m.jMonth();
      this.year = this.m.jYear();
      if (this.value) this.selectDay(this.m.jDate(), 'today');
    }

    this.updateMonth();

    if (this.data.disable) this.value = '';
  }
  public changeCalendarType() {
    this.calendarType = this.calendarType == 'en' ? 'fa' : 'en';
    if (this.calendarType == 'en') {
      this.months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    } else {
      this.months = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ];
    }

    this.updateMonth(undefined, 'today');
    // this.datePickerDialogRef.close(datePickerResult);
  }
  onChangeYear() {
    this.inputYearDialog = this.matDialog.open(this.yearDialog, {
      autoFocus: false,
      minWidth: '25vw',
      height: '100px',
    });
  }

  ngOnDestroy(): void {
    this.datePickerSub?.unsubscribe();
  }
  onChangeMonth() {
    let monthDialogRef = this.matDialog.open(MonthDialogComponent, {
      autoFocus: false,
    });
    monthDialogRef.afterClosed().subscribe((month: Month) => {
      if (month) {
        this.month = month.id - 1;
        this.updateDays();
      }
    });
  }
}
