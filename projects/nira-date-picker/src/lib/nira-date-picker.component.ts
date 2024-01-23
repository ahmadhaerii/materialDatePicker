import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
  DatePickerDialogInputData,
  DatePickerResult,
  NiraDatePickerService,
  Theme,
} from './nira-date-picker.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePickerDialogComponent } from './date-picker-dialog/date-picker-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-nira-date-picker',
  templateUrl: './nira-date-picker.component.html',
  styleUrls: ['./nira-date-picker.component.css'],
})
export class NiraDatePickerComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() selectToday: boolean = false;
  @Input() disable: boolean = false;
  @Input() changableYears: boolean = false;
  @Input() theme: Theme = {
    primaryColor: '#ff00ff',
    primaryTextColor: 'white',
    secondaryColor: '#0000ff',
  };
  @Input() defaultDate: string = '';
  @Output() isOpenCalenderChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() todayDate: EventEmitter<string> = new EventEmitter<string>();
  @Output() datePickerResult: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('decadeDialog') decadeDialog: any;
  @ViewChild('datePickerContainer')
  isOpen: boolean = false;
  @Input() get isOpenCalender() {
    return this.isOpen;
  }

  set isOpenCalender(isOpen: boolean) {
    this.isOpen = isOpen;
    this.isOpenCalenderChange.emit(this.isOpen);
  }
  datePickerContainer?: ElementRef<HTMLDivElement>;
  isTodaySub?: Subscription;
  result: string = '';
  public selectedMonth = 0;
  public calendarType = '';

  public years = [];

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.onShowCalendar();
    }
  }
  ngOnInit(): void {
    this.emitTodayDate();
  }

  ngAfterViewInit(): void {}

  emitTodayDate() {
    if (!this.defaultDate && this.selectToday) {
      const currentDate = this.m.jDate();
      const currentMonth = this.m.jMonth();
      const currentYear = this.m.jYear();

      const pad = (s: any) => (s.length < 2 ? 0 + s : s);

      const today =
        currentYear +
        '-' +
        pad((currentMonth + 1).toString()) +
        '-' +
        pad(currentDate.toString());
      this.todayDate.emit(today);
    }
  }

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

  private onShowCalendar() {
    let isChangeCalenderType: boolean = false;
    let dateDialogInputData: DatePickerDialogInputData = {
      disable: this.disable,
      defaultDate: this.defaultDate,
      isChangeCalenderType: isChangeCalenderType,
      theme: this.theme,
    };
    let datePickerDialogRef = this.matDialog.open(DatePickerDialogComponent, {
      data: dateDialogInputData,
      maxWidth: '100vw',
      autoFocus: false,
    });
    datePickerDialogRef.afterClosed().subscribe((data: DatePickerResult) => {
      this.isOpenCalender = false;
      if (data) {
        this.result = data.result;
        this.datePickerResult.emit(data.result);
      }
    });
  }
  ngOnDestroy(): void {
    this.isTodaySub?.unsubscribe();
  }
}
