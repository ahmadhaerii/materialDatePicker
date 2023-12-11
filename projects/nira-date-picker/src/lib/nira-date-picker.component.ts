import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import moment from 'jalali-moment';
import { NiraDatePickerService } from './nira-date-picker.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'lib-nira-date-picker',
  template: `
    <mat-form-field
      (click)="onShowCalendar()"
      class="datepicker-form-field"
      appearance="outline"
      style="justify-content: center;"
    >
      <mat-label style="font-size: 15px">{{ label }}</mat-label>
      <input
        disabled="{{ disable }}"
        aria-label="Date Picker"
        matInput
        [ngModel]="result.replaceAll('-', '/')"
        (ngModelChange)="result = $event"
        style="text-align: center; width: 85%; height: 24px; direction: ltr"
        (ngModelChange)="ChangeDate($event)"
      />
      <mat-icon
        class="text-colors"
        style="display: none; margin-top: -3px"
        [ngStyle]="{ color: disable ? 'gray' : '#3c096c' }"
        >date_range</mat-icon
      >
    </mat-form-field>

    <ng-template class="dialog" #dpDialog>
      <div class="dp-header">
        <div>
          <div
            *ngIf="loadingPrice"
            class="text-colors"
            style="margin-bottom: 15px"
          >
            ...در حال بارگذاری قیمت ها
            <span
              class="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        </div>

        <mat-icon
          style="vertical-align: middle;"
          (click)="updateMonth($event, 'dec')"
          class="month-btn"
          >keyboard_arrow_left</mat-icon
        >

        <button
          [disabled]="disable"
          mat-button
          matSuffix
          aria-label="Clear"
          (click)="yearSelector()"
        >
          {{ year }}
        </button>
        <label style="color: gray; font-weight: 500; font-size: 20px">
          {{ months[month] }}</label
        >
        <mat-icon
          class="month-btn"
          style="vertical-align: middle"
          (click)="updateMonth($event, 'inc')"
          >keyboard_arrow_right</mat-icon
        >
      </div>
      <div mat-dialog-content style="min-height: 282px">
        <div *ngIf="calendarType == 'en'" class="week-container">
          <span class="week day-of-week">Sun</span>
          <span class="week day-of-week">Mon</span>
          <span class="week day-of-week">Tue</span>
          <span class="week day-of-week">Wed</span>
          <span class="week day-of-week">Thu</span>
          <span class="week day-of-week">Fri</span>
          <span class="week day-of-week">Sat</span>
        </div>
        <div *ngIf="calendarType == 'fa'" class="week-container">
          <span class="week day-of-week">ش</span>
          <span class="week day-of-week">ی</span>
          <span class="week day-of-week">د</span>
          <span class="week day-of-week">س</span>
          <span class="week day-of-week">چ</span>
          <span class="week day-of-week">پ</span>
          <span class="week day-of-week">ج</span>
        </div>

        <hr class="line-hr" />

        <div *ngIf="calendarType == 'en'" class="Grid Grid--wrap day-container">
          <span
            *ngFor="let day of days"
            class="day Btn--pointer"
            [ngClass]="{
              isSelected: getSelectedDay(day, month),
              disabled: day == 0
            }"
            [ngStyle]="
              activeDay(day.toString())
                ? { color: 'black', 'font-weight': '500' }
                : { color: 'gray' }
            "
            (click)="selectDay(day, '')"
          >
            <ng-container *ngIf="day !== 0"> {{ day }}</ng-container>
            <br />
            <div>
              <label class="best-fare-label" style="font-size: 9px">
                {{ this.findBestFare(year, month, day) }}
              </label>
            </div>
          </span>
        </div>
        <div *ngIf="calendarType == 'fa'" class="Grid Grid--wrap day-container">
          <span
            *ngFor="let day of days"
            class="day Btn--pointer"
            [ngClass]="{
              isSelected: getSelectedDay(day, month),
              disabled: day == 0
            }"
            [ngStyle]="
              activeDay(day.toString())
                ? { color: 'black', 'font-weight': '500' }
                : { color: 'gray' }
            "
            (click)="selectDay(day, '')"
          >
            <ng-container *ngIf="day !== 0"> {{ day }}</ng-container>
            <br />
            <div>
              <label class="best-fare-label" style="font-size: 9px">
                {{ this.findBestFare(year, month, day) }}
              </label>
            </div>
          </span>
          <br />
        </div>
      </div>
      <hr class="line-hr" />
      <div class="dp-footer" mat-dialog-footer>
        <button class="footer-btn" (click)="updateMonth($event, 'today')">
          {{ calendarType == 'en' ? 'Today' : 'امروز' }}
        </button>
        <button class="footer-btn" (click)="changeCalendarType()">
          {{ calendarType == 'en' ? 'Shamsi' : 'میلادی' }}
        </button>
      </div>
    </ng-template>

    <ng-template id="yearDialog" class="dialog" #yearDialog>
      <div class="container">
        <div class="row">
          <div class="col">
            <button
              class="btn-simple"
              mat-icon-button
              style="float: right"
              (click)="backButton()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
            <label
              class="text-colors"
              style="float: right; margin: 10px 8px 0px; font-size: 15px"
            >
              انتخاب سال
            </label>
          </div>
        </div>
      </div>
      <hr class="line-hr" />
      <div mat-dialog-content style="padding: 0px">
        <div
          *ngIf="!decadeSelected"
          class="Grid Grid--wrap decade-container"
          style="padding: 5px 12px"
        >
          <span
            *ngFor="let decade of decades"
            class="decade Btn--pointer"
            (click)="selectDecade(decade)"
          >
            <br />
            <div>
              <label style="font-size: 14px; padding: 2px ; color: red"
                >{{ decade }} - {{ decade + 10 }}</label
              >
            </div>
          </span>
        </div>
        <div
          *ngIf="decadeSelected"
          class="Grid Grid--wrap dyear-container"
          style="padding: 5px"
        >
          <span
            *ngFor="let dyear of decadeYears"
            class="decade Btn--pointer"
            (click)="selectYear(dyear)"
          >
            <br />
            <div>
              <label style="font-size: 14px; padding: 2px">{{ dyear }}</label>
            </div>
          </span>
        </div>
      </div>
      <hr class="line-hr" />
    </ng-template>
  `,
  styles: `
.root{
  display: flex; justify-content: center;
}
.date {
  z-index: 10000;
  width: 255px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  position: absolute;
  display: none;
  top: calc(100% + 10px);
  left: 0;
}

.date.isActive {
  display: block;
}

.Btn--pointer{
  color:red
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  background-color: #7b2cbf;
  padding: 10px;
}

.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 30px;
  text-align: center;
}

.month-container {
  
  border-top-left-radius: 0.25em;
  border-top-right-radius: 0.25em;
  display: grid;
  grid-template-columns: auto auto;
  background-color: #7b2cbf;
  padding: 10px;
}

.week-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
  grid-gap: 15px;
  color: #7b2cbf;
}


.day {
  width: 2.5em;
  padding: 0.625em 0;
  text-align: center;
  padding: 0px;
  position: relative;
}

.day-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
  grid-row-gap: 1px;
  grid-column-gap: 1px;
}

.day {
  border-radius: 100%;
  height: 45px;
  width: 45px;
  padding-top: 3px;
  color: black;
}

.day:hover {
  background: #fdfdfd;
  border-radius: 5px;
  height: 45px;
  padding-top: 3px;
  color: red;
}

.example-full-width {
  width: 100%;
  color: #3c096c;
  font-size: 15px;
}

.day.isSelected {
  background: #7b2cbf;
  border-radius: 5px;
  width: 45px;
  height: 45px;
  padding-top: 3px;
  color: white !important;
}

.day:hover {
  border: 1px solid #7b2cbf;
  background: none;
  color:#3c096c ;
  border-radius: 5px;
  width: 45px;
  height: 45px;
  padding-top: 3px;
}

.day.isDeactive {
  color: rgb(209, 209, 209) !important;
}

.blue--dark {
  color: #00457a;
}

.dp-header {
  text-align: center;
  justify-content: center;
  margin-top:25px;
}
.dp-footer {
  text-align: center;
  justify-content: center;
}


.year-header {
  text-align: center;
  font-size: large;
  justify-content: center;
  vertical-align: middle;
}

.cancel-btn {
  font-size: 36px;
  border-radius: 100%;
  background: none;
  color: #DA1E37;
  width: 40px;
  height: 40px;
  border: none;
  padding: 0 !important;
  line-height: 1.2;
  display: flex;
  justify-content: right !important;
  text-align: end;
}

.dialog {
  position: relative;
  margin: 50px auto;
  width: 200px;
  background-color: black;
  height: 200px;
}

.footer-btn {
  border: 2px solid #fff;
  background-color: #5a189a;
  color: #fff;
  border-radius: 5px;
  width: 40%;
  font-size: 16px;
  padding: 5px;
  padding-top: 8px;
  margin: 5px;
}

.footer-btn:hover {
  border-radius: 5px;
  border: 2px solid #5a189a;
  color: #5a189a;
  background-color: transparent;
  width: 40%;
  font-size: 16px;
  padding: 5px;
  padding-top: 8px;
  margin: 5px;
}

.dp-footer {
  text-align: center;
  justify-content: center;

}

.month-btn {
  background: none;
  // border: 1px solid var(--buttonColor);
  color: #3c096c;
  border-radius:100%;
  padding:8px;
  cursor:pointer
  
}

.month-btn:hover {
  
  // border: 1px solid #ffffff;
  background-color:#7b2cbf;
  color: #fff;
  padding:8px;
 
  
}

.decade {
  padding: 4px;
  text-align: center;
  border: 1px #c4c4c4 solid;
  border-radius: 5px;
  color: #3c096c;
}

.decade-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-row-gap: 2px;
  grid-column-gap: 2px;
}

.dyear-container {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  background-color: #fafafa;
  grid-row-gap: 2px;
  grid-column-gap: 2px;
}

.decade:hover {
  background: #ffffff;
}

.year-button {
  margin-bottom: 10px;
  padding-top: 10px;
  border: 1px #d3d3d3 solid;
  color: #3c096c;
  border-radius: 5px;
  cursor: pointer;
}

.year-button:hover {
  margin-bottom: 10px;
  padding-top: 10px;
  border: 1px #d3d3d3 solid;
  background-color: #e7e7e7;
  color: #3c096c;
  border-radius: 5px;
  cursor: pointer;
}

.btn {
  border-radius: 6px;
  text-align: center;
  padding-bottom: 1px !important;
  font-size: 14px;
  transition: 0.3s;
  border: 1px #b4b4b4 solid;
  color: #505050;
  background-color: #ffffff;
}

.btn:hover {
  background-color: #cacaca;
}

::ng-deep .mat-form-field-infix {
  width: 93px !important;
  display: flex;
}

::ng-deep .mat-form-field-appearance-outline .mat-form-field-flex {
  height: 60px;
}

.datepicker-form-field > ::ng-deep .mat-form-field-infix {
  display: flex;
}

::ng-deep .mat-card {
  padding: 1px !important;
}

.btn-simple {
  background-color: transparent;
  border: none;
  border-radius: 2%;
  padding: 7px 5px 0px;
}

.dividing-line {
  background-color: #5a189a;
}

.days {
  border: 1px solid #5a189a;
  font-size: 9px;
}

.text-colors {
  color: var(#3c096c);
}

.line-hr {
  background-color: #5a189a;
}

.best-fare-label {
  border-top: 1px solid #5a189a;
}

.disabled {
  pointer-events: none;
}

.day-of-week {
  text-align: center;
}

.mat-form-field-wrapper {
  width: 100%;
}

.mat-form-field-appearance-outline .mat-form-field-infix {
  padding: 1em 0 1em 0;
  display: flex !important;
}`,
})
export class NiraDatePickerComponent implements OnChanges, OnInit, DoCheck {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() disable: boolean = false;
  @Input() bestFares: { Departure: ''; TotalPrice: '' }[] = [
    { Departure: '', TotalPrice: '' },
  ];
  @Input() defaultDate = '';
  @Input() changableYears: boolean = false;
  @ViewChild('dpDialog') dpDialog: any;
  @ViewChild('yearDialog') yearDialog: any;

  @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();

  dialogRef: any;

  loadingPrice: boolean = false;

  public selectedMonth = 0;
  public calendarType = '';
  public date: Date = new Date();
  public years = [];
  public yearSelectorVisible = false;
  public decades: number[] = [];
  public decade: any;
  public decadeYears: any = [];
  public decadeSelected = false;
  public month!: number;
  year!: number;
  days: number[] = [];
  public fare = 200;
  public m = moment();
  days2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
  // organizationColor = {
  //   textColor: '#A71E34',
  //   buttonColor: '#BD1F36',
  //   backgroundColor: '#B21E35',
  //   commonColor: '#85182A',
  //   tableColor: '#F05265',
  //   profileColor: '#c2113a',
  //   Color: 'Red',
  // };

  selectedDay?: number;
  showCalendar: boolean = false;
  result: string = '';

  constructor(
    public dialog: MatDialog,
    private niraService: NiraDatePickerService
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    // this.loadingPrice = true;
    if (this.bestFares.length < 1) this.loadingPrice = true;
    else if (this.bestFares.length > 1) this.loadingPrice = false;
  }
  ngOnInit(): void {
    this.setDefaultValues();
    // if (this.config.currentConfig)
    //   this.organizationColor = this.config.currentConfig.organizationColor;
  }
  ngDoCheck() {
    if (this.bestFares !== undefined) {
      this.days = [];
      this.updateMonth();
    }
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
    this.dialogRef.close();
    this.onShowCalendar();
  }

  yearSelector() {
    if (this.calendarType == 'en') return;

    this.yearSelectorVisible = !this.yearSelectorVisible;
    this.dialogRef.close();
    this.dialogRef = this.dialog.open(this.yearDialog);
  }

  public updateYear(e?: Event, type?: string) {
    // if (e) e.stopPropagation();
    if (type === 'dec') this.year--;
    this.days = [];

    if (type === 'inc') this.year++;
    this.days = [];
  }

  selectYear(year: any) {
    try {
      this.decadeSelected = false;
      const pad = (s: any) => (s.length < 2 ? 0 + s : s);
      this.year = year;
      this.date = new Date(
        year,
        this.month,
        Number(this.getCurrentDayShamsi())
      );
      if (!this.disable)
        this.result = `${year}-${pad(this.month + 1 + '')}-${pad(
          this.getCurrentDayShamsi() + ''
        )}`;
      else this.result = '';

      this.onUpdate.emit({ selected: this.result });
      this.dialogRef.close();

      this.dialogRef = this.dialog.open(this.dpDialog);
    } catch (err) {
      // this.Console.LOG(5, 'selectyear' + err);
    }
  }

  selectDecade(decade: any) {
    try {
      this.decadeYears = [];
      this.decadeSelected = true;
      for (let i = decade; i < decade + 10; i++) {
        this.decadeYears.push(i);
      }
    } catch (err) {
      // this.Console.LOG(5, 'selectyear' + err);
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

  public getCurrentMonthShamsi(): number {
    // var ndt: NDateTime = new NDateTime();
    let mon = this.niraService.getShamsiMon().valueOf();
    return mon;
  }

  public getCurrentMonthMiladi(): Number {
    // var ndt: NDateTime = new NDateTime();
    let mon = this.niraService.getMiladiMon();
    return mon;
  }

  public getCurrentDayShamsi(): Number {
    //var ndt: NDateTime = new NDateTime();
    let day = this.niraService.getShamsiDay();
    return day;
  }

  ChangeDate(newDate: string) {
    this.result = newDate;
    if (this.result.length == 4 || this.result.length == 7) this.result += '-';

    if (this.result.length == 10) this.onUpdate.emit({ selected: this.result });
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
      //const prefix = new Array(day);
      for (let i = 1; i < day; i++) this.days.push(0);

      for (let i = 1; i <= days; i++) this.days.push(i);
    } else if (this.calendarType == 'fa') {
      let Jstr = this.year + '/' + (this.month + 1).toString() + '/' + '01';
      let Jdate = moment(Jstr, 'jYYYY/jM/jD'); // Parse a Jalaali date
      const days = Jdate.jDaysInMonth();
      const day = Jdate.jDay();
      for (let i = 0; i < day; i++) this.days.push(0);

      for (let i = 1; i <= days; i++) {
        if (this.bestFares != undefined) this.days.push(i);
        else this.days.push(i);
      }
    }
  }

  selectDay(day: number, type: string) {
    //  if (!day) return;
    try {
      const pad = (s: any) => (s.length < 2 ? 0 + s : s);
      this.date = new Date(this.year, this.month, day);

      if (!this.disable) {
        this.result = `${this.year}-${pad(this.month + 1 + '')}-${pad(
          day + ''
        )}`;
        // const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        // this.result = p2e(this.result);
        // let ndt = new NDateTime2();
        this.selectedDay = parseInt(this.result.substring(8));
      } else this.result = '';
      this.onUpdate.emit({ selected: this.result });
      if (type !== 'today') this.dialogRef.close();
    } catch (err) {
      // this.Console.LOG(5, err);
    }
  }

  public getToday() {
    const pad = (s: any) => (s.length < 2 ? 0 + s : s);
    let dt = new Date();
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1 + '')}-${pad(
      dt.getDate() + ''
    )}`;
  }

  onShowCalendar() {
    const dialogConfig = new MatDialogConfig();
    this.dialogRef = this.dialog.open(this.dpDialog, {
      maxWidth: '100vw',
      autoFocus: false,
    });
  }

  public setDefaultValues() {
    /// years config
    // let ndt: NDateTime = new NDateTime();
    let currentYear = this.niraService.getShamsiYear();
    for (let i = Number(currentYear) - 100; i < Number(currentYear) + 20; i++) {
      if (i % 10 == 0) this.decades.push(i);
    }

    let strdefaultDate: string = this.defaultDate;

    if (strdefaultDate != undefined && strdefaultDate.length > 8) {
      let dateParts: string[] = this.defaultDate.split('-');
      let strYear = dateParts[0];
      let year = new Number(strYear);
      this.value = this.defaultDate;
      if (+year > 1500) {
        this.value = new Date(this.value).toLocaleDateString();
        //this.date = new Date(this.value);
        this.calendarType = 'en';
      } else {
        // let ndt: NDateTime = new NDateTime();
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

    if (this.disable) this.value = '';
  }

  findBestFare(year: number, month: number, day: number) {
    // let ndt: NDateTime = new NDateTime();
    let currentDate = '';
    let ret = '';
    //ndt.setMiladyYDM(this.year,month+1,day)
    //currentDate = ndt.getMiladiDateStr();
    if (this.calendarType == 'en') {
      this.niraService.setMiladyYDM(year, month + 1, day);
      currentDate = this.niraService.getMiladiDateStr();
    }
    if (this.calendarType == 'fa') {
      this.niraService.setShamsiYDM(year, month + 1, day);
      currentDate = this.niraService.getMiladiDateStr();
    }
    if (this.bestFares !== undefined && this.bestFares.length > 1) {
      for (let i = 0; i < this.bestFares.length; i++) {
        if (this.bestFares[i] && this.bestFares[i].Departure == currentDate)
          ret = this.bestFares[i].TotalPrice;
      }
    }
    return Number(ret) / 10 > 10 ? (Number(ret) / 10).toLocaleString() : '';
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

  backButton() {
    this.dialogRef.close();
    this.onShowCalendar();
  }
}
