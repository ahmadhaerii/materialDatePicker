import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lib-nira-date-picker',
  templateUrl: './nira-date-picker.component.html',
  styleUrls: ['./nira-date-picker.component.css'],
})
export class NiraDatePickerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() disable: boolean = false;
  @Input() label: string = '';
  @Input() defaultDate = '';
  @Input() changableYears: boolean = false;
  @Input() theme: Theme = {
    primaryColor: '#ff0000',
    primaryTextColor: 'white',
    secondaryColor: '#0000ff',
  };
  @ViewChild('decadeDialog') decadeDialog: any;

  @ViewChild('datePickerContainer')
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
  datePickerFrmGrp: FormGroup = {} as FormGroup;
  constructor(
    private matDialog: MatDialog,
    private niraService: NiraDatePickerService
  ) {}

  ngOnInit(): void {
    this.datePickerFrmGrp = new FormGroup({
      datePickerFrmCtrl: new FormControl(null, Validators.required),
    });
    this.isTodaySub = this.niraService.isTodaySubj.subscribe(
      (isToday: boolean) => {
        if (isToday) {
          const pad = (s: any) => (s.length < 2 ? 0 + s : s);
          const currentDay = moment().jDate();
          const currentMonth = moment().jMonth();
          const currentYear = moment().jYear();
          this.result = `${currentYear}-${pad(currentMonth + 1 + '')}-${pad(
            currentDay + ''
          )}`;
          this.datePickerFrmGrp.setValue({
            datePickerFrmCtrl: this.result,
          });
        }
      }
    );
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
    const defaultDate = this.datePickerFrmGrp.get('datePickerFrmCtrl')?.value;

    let isChangeCalenderType: boolean = false;
    let dateDialogInputData: DatePickerDialogInputData = {
      disable: this.disable,
      defaultDate: defaultDate,
      isChangeCalenderType: isChangeCalenderType,
      theme: this.theme,
    };
    let datePickerDialogRef = this.matDialog.open(DatePickerDialogComponent, {
      data: dateDialogInputData,
      maxWidth: '100vw',
      autoFocus: false,
    });
    datePickerDialogRef.afterClosed().subscribe((data: DatePickerResult) => {
      if (data) {
        if (data.isToday) {
        } else {
          this.result = data.result;
          // this.result=this.result.replaceAll('-','/')
          this.datePickerFrmGrp.setValue({
            datePickerFrmCtrl: this.result,
          });
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.isTodaySub?.unsubscribe();
  }
}
