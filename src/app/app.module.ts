import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NiraDatePickerModule } from '../../projects/nira-date-picker/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NiraDatePickerModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
