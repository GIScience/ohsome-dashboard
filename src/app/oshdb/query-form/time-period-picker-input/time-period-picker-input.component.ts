import {
  AfterViewInit,
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import Utils from '../../../../utils';

declare let $: any;

@Component({
  selector: 'app-time-period-picker-input',
  templateUrl: './time-period-picker-input.component.html',
  styleUrls: ['./time-period-picker-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePeriodPickerInputComponent),
      multi: true
    }
  ]
})

export class TimePeriodPickerInputComponent implements ControlValueAccessor, AfterViewInit {

  ngAfterViewInit() {

    const offset = (this.options.minDate) ? moment(this.options.minDate).utcOffset() : 0;
    const minDate = (this.options.minDate) ? moment(this.options.minDate).add(-offset, 'm').toDate() : null;
    const maxDate = (this.options.maxDate) ? moment(this.options.maxDate).add(-offset, 'm').toDate() : null;

    const startSetting = {

      startMode: 'year',
      ampm: false,
      minDate: minDate,
      maxDate: maxDate,
      formatter: {
        datetime: this.datetimeFormatter
      }
    };

    $('#start').calendar(startSetting);


    const endSetting = {

      startMode: 'year',
      ampm: false,
      minDate: minDate,
      maxDate: maxDate,
      formatter: {
        datetime: this.datetimeFormatter
      }
    };

    $('#end').calendar(endSetting);

  }

  @Input() options = {minDate: null, maxDate: null};

  private _value = '//'; // the start/end/period string

  get value(): string {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  // ControlValueAccesor methods
  writeValue(val: string): void {
    this.value = val || '//';
    const timeParts = this.value.split('/');
    this.start = timeParts[0];
    this.end = timeParts[1];
    this.period = timeParts[2];
    console.log('writeValue this.start:', this.start);
    $('#start').calendar('set date', this.start, true, false); //date, updateinput, firechange
    $('#end').calendar('set date', this.end, true, false);
  }

  propagateChange = (_: any) => {
    console.log('propagateChange', _);
  };

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.propagateChange = fn;
    // throw new Error("Method not implemented.");
  }

  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // throw new Error("Method not implemented.");
  }

  @Input() disabled = false;


  private _start = '';
  get start(): string {
    return this._start;
  }

  /**
   *
   * @param val An ISO8601 UTC Date/Time String eg. 2010-03 or 2010-03-15 or 2010-03-15T14:20:00Z
   */
  set start(val: string) {
    this._start = val;
    const timeParts = this.value.split('/');
    timeParts[0] = val;
    this.value = timeParts.join('/');
  }

  /**
   * onChange callback for semantic-ui-calendar
   * @param date
   */
  onStartChange(date: Date) {
    console.log('datePicker: onStartChange');
    const offset = moment(date).utcOffset();
    const utctime = moment(date).add(offset, 'm').toISOString().replace(/\.\d+Z/, 'Z');

    this.start = utctime;

    //propagat complete start/end/period String
    //this.propagateChange(this.value);
  }

  /**
   * onBlur callback for semantic-ui-calendar
   */
  onStartBlur() {
    const date = $('#start').calendar('get date');
    if (date == null) {
      this.start = '';
    } else {
      const offset = moment(date).utcOffset();
      const utctime = moment(date).add(offset, 'm').toISOString().replace(/\.\d+Z/, 'Z');

      this.start = utctime;
    }

    //propagate complete start/end/period String
    this.propagateChange(this.value);
  }

  private _end = '';
  get end(): string {
    return this._end;
  }

  set end(val: string) {
    this._end = val;
    const timeParts = this.value.split('/');
    timeParts[1] = val;
    this.value = timeParts.join('/');
  }

  onEndChange(date: Date) {
    const offset = moment(date).utcOffset();
    const utctime = moment(date).add(offset, 'm').toISOString().replace(/\.\d+Z/, 'Z');

    this.end = utctime;

    //this.propagateChange(this.value);
  }

  /**
   * onBlur callback for semantic-ui-calendar
   */
  onEndBlur() {
    const date = $('#end').calendar('get date');
    if (date == null) {
      $('#end').calendar('set date', this.end, true, false);
      return;
    }
    const offset = moment(date).utcOffset();
    const utctime = moment(date).add(offset, 'm').toISOString().replace(/\.\d+Z/, 'Z');

    this.end = utctime;

    //propagate complete start/end/period String
    this.propagateChange(this.value);
  }


  @Input() periodOptions: { name: string, value: string }[] = [
    {name: 'hourly', value: 'PT1H'},
    {name: 'daily', value: 'P1D'},
    {name: 'weekly', value: 'P1W'},
    {name: 'monthly', value: 'P1M'},
    {name: 'quarterly', value: 'P3M'},
    {name: 'yearly', value: 'P1Y'},
  ];
  // public selectedPeriod = this.periodOptions[2];

  private _period = '';
  get period(): string {
    return this._period;
  }

  set period(val: string) {
    this._period = val;
    const timeParts = this.value.split('/');
    timeParts[2] = val;
    this.value = timeParts.join('/');
  }

  onPeriodChange($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.period = target.value;
    this.propagateChange(this.value);
  }

  periodCheck(start: string, end: string, period: string) {
    const maxCount = 200;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // diff in hours
    // console.log(start, end, period, diff);
    return (period === 'PT1H' && diff > maxCount) ||
      (period === 'P1D' && diff > maxCount * 24) ||
      (period === 'P1W' && diff > maxCount * 24 * 7);
  }

  datetimeFormatter(date: Date): string {
    if (date == null) {
      return '';
    }
    const offset = moment(date).utcOffset();
    return moment(date).add(offset, 'm').toISOString().replace(/\.\d+Z/, 'Z');
  }

  autoStartDate(): string {
    return Utils.calculateStartDateFromEndAndPeriod(this.end, this.period, this.options.minDate);
  }
}
