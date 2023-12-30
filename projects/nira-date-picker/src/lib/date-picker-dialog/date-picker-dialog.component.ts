import {
  Component,
  DoCheck,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import moment from 'jalali-moment';
import {
  DatePicker,
  Month,
  NiraDatePickerService,
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
export class DatePickerDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() bestFares: { Departure: ''; TotalPrice: '' }[] = [
    { Departure: '', TotalPrice: '' },
  ];
  @ViewChild('yearDialog') yearDialog: any;

  public month!: number;
  days: number[] = [];
  public calendarType = 'fa';
  public m = moment();
  year!: number;
  public date: Date = new Date();
  result: string = '';
  selectedDay?: number;
  isChangeCalenderType: boolean = false;
  public yearSelectorVisible = false;
  decadeDialogRef: any;
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
    @Inject(MAT_DIALOG_DATA) public data: DatePicker,
    private niraService: NiraDatePickerService,
    private matDialog: MatDialog
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.bestFares.length < 1) this.loadingPrice = true;
    else if (this.bestFares.length > 1) this.loadingPrice = false;
  }
  ngOnInit(): void {
    this.currentShamsiDay = this.m.jDate();
    console.log('days:', this.days);
    this.yearFrmGrp = new FormGroup({
      yearFrmCtrl: new FormControl(null, Validators.required),
    });
    this.setDefaultValues();
  }

  public getCurrentDayShamsi(): Number {
    //var ndt: NDateTime = new NDateTime();
    let day = this.niraService.getShamsiDay();
    return day;
  }
  updateYearInDatePicker() {
    const pad = (s: any) => (s.length < 2 ? 0 + s : s);
    let inputYear = this.yearFrmGrp.get('yearFrmCtrl')?.value;
    if (this.yearFrmGrp.get('yearFrmCtrl')?.valid) {
      const pad = (s: any) => (s.length < 2 ? 0 + s : s);
      this.year = this.yearFrmGrp.get('yearFrmCtrl')?.value;
      this.inputYearDialog.close();
    }
  }
  selectDay(day: number, type: string) {
    try {
      const currentShamsiDay = Number(this.getCurrentDayShamsi());
      const pad = (s: any) => (s.length < 2 ? 0 + s : s);
      this.date = new Date(this.year, this.month, day);

      if (!this.data.disable) {
        this.result = `${this.year}-${pad(this.month + 1 + '')}-${pad(
          day + ''
        )}`;
      } else {
        this.result = '';
      }
      if (currentShamsiDay < day) {
        console.log(this.result);
        let datePickerResult: DatePickerResult = {
          result: this.result,
          isChangeCalenderType: false,
        };
        this.datePickerDialogRef.close(datePickerResult);
      }

      // if (type !== 'today') this.datePickerDialogRef.close(this.result);
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
      } else if (this.calendarType == 'en') {
        this.month = new Date().getMonth();
        this.year = new Date().getFullYear();
        this.selectDay(new Date().getDate(), 'today');
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
      for (let i = 0; i < day; i++) this.days.push(0);

      for (let i = 1; i <= days; i++) {
        if (this.bestFares != undefined) this.days.push(i);
        else this.days.push(i);
      }
    }
  }

  public getSelectedDay(day: number, month: number): boolean {
    let isTheSame: boolean = false;

    if (
      parseInt(this.result.substring(8)) == day &&
      month + 1 == parseInt(this.result.substring(5, 7))
    )
      isTheSame = true;
    return isTheSame;
  }

  activeDay(day: string) {
    let today;
    let currentMonth;

    if (this.calendarType == 'en') {
      let dt = new Date();
      today = dt.getDate();
      currentMonth = dt.getMonth();
    } else {
      this.m = moment();
      today = this.m.jDate();
      currentMonth = this.m.jMonth();
    }

    if (
      (Number(day) <= today && this.month == currentMonth) ||
      this.month < currentMonth
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
      if (this.value) this.selectDay(this.date.getDate(), '');
    } else if (this.calendarType === 'fa') {
      this.month = this.m.jMonth();
      this.year = this.m.jYear();
      if (this.value) this.selectDay(this.m.jDate(), '');
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
    let datePickerResult: DatePickerResult = {
      result: this.result,
      isChangeCalenderType: true,
    };
    this.updateMonth(undefined, 'today');
    this.datePickerDialogRef.close(datePickerResult);
  }
  onChangeYear() {
    this.inputYearDialog = this.matDialog.open(this.yearDialog, {
      autoFocus: false,
      width: 'auto',
    });
  }

  ngOnDestroy(): void {
    this.datePickerSub?.unsubscribe();
  }
  onChangeMonth() {
    let monthDialogRef = this.matDialog.open(MonthDialogComponent);
    monthDialogRef.afterClosed().subscribe((month: Month) => {
      if (month) {
        this.month = month.id - 1;
      }
    });
  }
}
