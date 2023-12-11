import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiraDatePickerComponent } from './nira-date-picker.component';

describe('NiraDatePickerComponent', () => {
  let component: NiraDatePickerComponent;
  let fixture: ComponentFixture<NiraDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NiraDatePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NiraDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
