import { Component, Injectable } from '@angular/core';
import moment from 'jalali-moment';
import { DatePickerDialogComponent } from './date-picker-dialog/date-picker-dialog.component';

import { Subject } from 'rxjs';

export interface Theme{
  primaryColor:string;
  primaryTextColor:string;
  secondaryColor:string
}
export interface DatePickerDialogInputData {
  disable: boolean;
  defaultDate: string;
  isChangeCalenderType: boolean;
  theme:Theme
}

export interface DatePickerResult {
  result: string;
  isChangeCalenderType: boolean;
  isToday:boolean;
}

export interface Month {
  id: number;
  name: string;
}
export interface Season {
  id: number;
  name: string;
  months: Month[];
}
@Injectable({
  providedIn: 'root',
})
export class NiraDatePickerService {
  isTodaySubj: Subject<boolean> = new Subject<boolean>();
  internalDate: Date;

  backToDataPickerDialog: Subject<boolean> = new Subject<boolean>();

  private seasons: Season[] = [
    {
      id: 1,
      name: 'بهار',
      months: [
        { id: 1, name: 'فروردین' },
        { id: 2, name: 'اردیبهشت' },
        { id: 3, name: 'خرداد' },
      ],
    },
    {
      id: 2,
      name: 'تابستان',
      months: [
        { id: 4, name: 'تیر' },
        { id: 5, name: 'مرداد' },
        { id: 6, name: 'شهریور' },
      ],
    },
    {
      id: 3,
      name: 'پاییز',
      months: [
        { id: 7, name: 'مهر' },
        { id: 8, name: 'آبان' },
        { id: 9, name: 'آذر' },
      ],
    },
    {
      id: 1,
      name: 'زمستان',
      months: [
        { id: 10, name: 'دی' },
        { id: 11, name: 'بهمن' },
        { id: 12, name: 'اسفند' },
      ],
    },
  ];

  constructor() {
    this.internalDate = new Date();
  }

  get getSeasons() {
    return this.seasons;
  }
  public setShamsiDateStr(shamsitStr: string) {
    let n = shamsitStr.search('/');
    if (n > 0) shamsitStr = shamsitStr.replace('/', '-');
    let miladiStr = moment
      .from(shamsitStr, 'fa', 'YYYY/MM/DD')
      .format('YYYY-MM-DD');
    this.internalDate = new Date(miladiStr);
  }

  public setMiladiDateStr(miladiStr: string) {
    this.internalDate = new Date(miladiStr);
  }

  public setMiladiDateTimeStr(
    miladiStr: string //: NDateTime
  ) {
    miladiStr = miladiStr.replace(' ', 'T');
    this.internalDate = new Date(miladiStr);
  }

  public setTimeStr(timeStr: String) {
    let s = this.getMiladiDateStr() + 'T' + timeStr;
    this.internalDate = new Date(s);
  }

  public LZ(s: string, n: number): string {
    let ret = s;
    if (ret.length < n) {
      let m = n - ret.length;
      for (let i = 0; i < m; i++) ret = '0' + ret;
    }
    return ret;
  }

  public getHour(): number {
    let ret = this.internalDate.getHours();
    return ret;
  }

  public setHour(hour: number) {
    let timeStr =
      this.LZ(hour.toString(), 2) +
      ':' +
      this.LZ(this.getMinute().toString(), 2) +
      ':' +
      this.LZ(this.getSecond().toString(), 2);
    this.setTimeStr(timeStr);
  }

  public setMinute(min: number) {
    let timeStr =
      this.LZ(this.getHour().toString(), 2) +
      ':' +
      this.LZ(min.toString(), 2) +
      ':' +
      this.LZ(this.getSecond().toString(), 2);
    this.setTimeStr(timeStr);
  }

  public setSecond(second: number) {
    let timeStr =
      this.LZ(this.getHour().toString(), 2) +
      ':' +
      this.LZ(this.getMinute().toString(), 2) +
      ':' +
      this.LZ(second.toString(), 2);
    this.setTimeStr(timeStr);
  }

  public getMinute(): number {
    let ret = this.internalDate.getMinutes();
    return ret;
  }

  public getSecond(): number {
    let ret = this.internalDate.getSeconds();
    return ret;
  }

  public getTimeStr(): string {
    let h = this.getHour();
    let m = this.getMinute();
    let s = this.getSecond();
    let ret =
      this.LZ(h.toString(), 2) +
      ':' +
      this.LZ(m.toString(), 2) +
      ':' +
      this.LZ(s.toString(), 2);
    return ret;
  }

  public getMiladiDateStr(): string {
    var ret: string = '';
    let y = this.internalDate.getFullYear();
    let m = this.internalDate.getMonth() + 1;
    let d = this.internalDate.getDate();

    let mm = '';
    if (m.toString().length < 2) mm = '0' + m;
    else mm = m.toString();

    let dd = '';
    if (d.toString().length < 2) dd = '0' + d;
    else dd = d.toString();
    ret = y + '-' + mm + '-' + dd;

    return ret;
  }

  public getMiladiDateTimeStr(): string {
    return this.getMiladiDateStr() + ' ' + this.getTimeStr();
  }

  public getShamsiDateTimeStr(): string {
    return this.getShamsiDateStr() + ' ' + this.getTimeStr();
  }

  public setMiladyYDM(year: any, mon: any, day: any) {
    let y = year;
    let m = Number(mon).toString();
    let d = Number(day).toString();
    if (m.length < 2) m = '0' + m;
    if (d.length < 2) d = '0' + d;
    let miladiStr = y + '-' + m + '-' + d;
    let timeStr = this.getTimeStr();
    this.internalDate = new Date(miladiStr + 'T' + timeStr);
  }

  public setShamsiYDM(year: any, mon: any, day: any) {
    let y = year;
    let m = Number(mon).toString();
    let d: String = day;
    if (m.length < 2) m = '0' + m;
    if (d.length < 2) d = '0' + d;
    let shamsiStr = y + '-' + m + '-' + d;
    let miladiStr = moment
      .from(shamsiStr, 'fa', 'YYYY/MM/DD')
      .format('YYYY-MM-DD');
    let timeStr = this.getTimeStr();
    this.internalDate = new Date(miladiStr + 'T' + timeStr);
  }

  public getMiladiYear(): Number {
    return this.internalDate.getFullYear();
  }

  public getMiladiMon(): Number {
    return this.internalDate.getMonth() + 1;
  }

  public getMiladiDay(): Number {
    return this.internalDate.getDate();
  }

  public getMiladiDayOfYear() {
    let start: number = new Date(
      this.internalDate.getFullYear(),
      0,
      0
    ).getTime();
    let diff: number = this.internalDate.getTime() - start;
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);
    return day;
  }

  public getTimeDiff(startDate: any, endDate: any) {
    // let start: number = new Date(this.internalDate.getFullYear(), 0, 0).getTime();
    // let diff: number = this.internalDate.getTime() - start;
    // let oneDay = 1000 * 60 * 60 * 24;
    // let day = Math.floor(diff / oneDay);

    let diff = endDate.getTime() - startDate.getTime();
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    let minutes =
      Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
    let seconds =
      Math.floor(diff / 1000) -
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    return { hour: hours, minute: minutes };
  }

  public getShamsiYear(): Number {
    let ds = this.getShamsiDateStr();
    let dt = ds.split('-');
    return new Number(dt[0]);
  }

  public getShamsiMon(): Number {
    let ds = this.getShamsiDateStr();
    let dt = ds.split('-');
    return new Number(dt[1]);
  }

  public getShamsiDay(): Number {
    let ds = this.getShamsiDateStr();
    let dt = ds.split('-');
    return new Number(dt[2]);
  }

  public getDayOfWeek() {
    return this.internalDate.getDay();
  }

  public getShamsiDateStr(): string {
    var ret: string = '';
    let miladi = this.getMiladiDateStr();
    let mo = moment(miladi, 'YYYY/MM/DD');
    let y = mo.jYear();
    let m = mo.jMonth() + 1;
    let d = mo.jDate();

    let mm = '';
    if (m.toString().length < 2) mm = '0' + m;
    else mm = m.toString();

    let dd = '';
    if (d.toString().length < 2) dd = '0' + d;
    else dd = d.toString();
    ret = y + '-' + mm + '-' + dd;

    return ret;
  }

  public isAfter(ndt: NiraDatePickerService): boolean {
    let ret = this.internalDate > ndt.internalDate;
    return ret;
  }

  public isBefore(ndt: NiraDatePickerService): boolean {
    let ret = this.internalDate < ndt.internalDate;
    return ret;
  }

  public incYear(n: number) {
    var d = moment(this.getMiladiDateTimeStr());
    var dt = d.add(n, 'years');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
  }

  public incMonth(n: number) {
    var d = moment(this.getMiladiDateStr());
    var dt = d.add(n, 'months');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
  }

  public incDays(n: number) {
    var d = moment(this.getMiladiDateStr());
    var dt = d.add(n, 'days');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
  }

  public incHours(n: number) {
    let d = moment(this.getMiladiDateTimeStr());
    let dt = d.add(n, 'hours');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
    let h = dt.hours();
    let m = dt.minutes();
    let s = dt.seconds();
    let timeStr =
      this.LZ(h.toString(), 2) +
      ':' +
      this.LZ(m.toString(), 2) +
      ':' +
      this.LZ(s.toString(), 2);
    this.setTimeStr(timeStr);
  }

  public incMinutes(n: number) {
    var d = moment(this.getMiladiDateTimeStr());
    var dt = d.add(n, 'minutes');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
    let h = dt.hours();
    let m = dt.minutes();
    let s = dt.seconds();
    let timeStr =
      this.LZ(h.toString(), 2) +
      ':' +
      this.LZ(m.toString(), 2) +
      ':' +
      this.LZ(s.toString(), 2);
    this.setTimeStr(timeStr);
  }

  public incSeconds(n: number) {
    var d = moment(this.getMiladiDateTimeStr());
    var dt = d.add(n, 'seconds');
    this.setMiladyYDM(dt.year(), dt.month() + 1, dt.date());
    let h = dt.hours();
    let m = dt.minutes();
    let s = dt.seconds();
    let timeStr =
      this.LZ(h.toString(), 2) +
      ':' +
      this.LZ(m.toString(), 2) +
      ':' +
      this.LZ(s.toString(), 2);
    this.setTimeStr(timeStr);
  }

  public daysBetween(ndt2: NiraDatePickerService): number {
    let ret: number = 0;
    let n: number =
      (this.getMiladiYear().valueOf() - ndt2.getMiladiYear().valueOf()) * 365;
    ret = n + this.getMiladiDayOfYear() - ndt2.getMiladiDayOfYear();
    if (ret < 0) ret = -1 * ret;
    return ret;
  }
}
