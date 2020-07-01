import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxParallaxScrollModule } from '../../projects/ngx-parallax-scroll/src/lib/ngx-parallax-scroll.module';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxParallaxScrollModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
