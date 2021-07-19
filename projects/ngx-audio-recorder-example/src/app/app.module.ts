import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxAudioRecorderModule } from 'ngx-audio-recorder';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxAudioRecorderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
