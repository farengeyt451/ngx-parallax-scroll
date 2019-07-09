import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxParallaxScrollModule } from 'ngx-parallax-scroll';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxParallaxScrollModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
