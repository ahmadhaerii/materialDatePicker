import { TestBed } from '@angular/core/testing';

import { NiraDatePickerService } from './nira-date-picker.service';

describe('NiraDatePickerService', () => {
  let service: NiraDatePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiraDatePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
