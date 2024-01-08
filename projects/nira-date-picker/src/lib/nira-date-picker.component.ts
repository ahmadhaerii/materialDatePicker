import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import moment from 'jalali-moment';
import {
  DatePickerResult,
  NiraDatePickerService,
} from './nira-date-picker.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePickerDialogComponent } from './date-picker-dialog/date-picker-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-nira-date-picker',
  templateUrl: './nira-date-picker.component.html',
  styleUrls: ['./nira-date-picker.component.css'],
})
export class NiraDatePickerComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  @Input() isOpenCalender: boolean = false;
  @Input() disable: boolean = false;
  @Input() theme: string = '#5a189a';
  @Input() label: string = '';

  @Input() defaultDate = '';
  @Input() changableYears: boolean = false;

  @ViewChild('decadeDialog') decadeDialog: any;

  @ViewChild('datePickerContainer')
  datePickerContainer?: ElementRef<HTMLDivElement>;
  result: string = '';
  public selectedMonth = 0;
  public calendarType = '';

  public years = [];
  datePickerDialogSub?: Subscription;

  public decade: any;
  datePickerDialogRef: any;
  isHoverTodayBtn: boolean = false;
  isHoverCalenderTypeBtn: boolean = false;
  public fare = 200;
  public m = moment();
  days2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  showCalendar: boolean = false;

  backgroundBtnColor: string = 'red';

  constructor(
    private matDialog: MatDialog,
    private niraService: NiraDatePickerService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    if (this.isOpenCalender) {
      this.onShowCalendar();
    }
    this.backgroundBtnColor = 'green';
  }
  ngAfterViewInit(): void {}

  public getCurrentMonthShamsi(): number {
    let mon = this.niraService.getShamsiMon().valueOf();
    return mon;
  }

  public getCurrentMonthMiladi(): Number {
    let mon = this.niraService.getMiladiMon();
    return mon;
  }

  ChangeDate(newDate: string) {
    this.result = newDate;
    if (this.result.length == 4 || this.result.length == 7) this.result += '-';
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

    let datePickerDialogRef = this.matDialog.open(DatePickerDialogComponent, {
      data: { disable: this.disable, defaultDate: this.defaultDate },
      maxWidth: '100vw',
      autoFocus: false,
    });
    datePickerDialogRef.afterClosed().subscribe((data: DatePickerResult) => {
      if (data) {
        this.result = data.result;
        if (data.isChangeCalenderType) {
          this.onShowCalendar();
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.datePickerDialogSub?.unsubscribe();
  }
  // this.niraService.setSelectedYear(year);
}
