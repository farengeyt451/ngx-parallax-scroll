import {
  Component,
  AfterContentInit,
  AfterViewInit,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
import { NgxParallaxScrollConfig } from 'projects/ngx-parallax-scroll/src/public-api';
import { NgxParallaxScrollService } from 'projects/ngx-parallax-scroll/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('someInput', { static: true }) someInput: ElementRef;
  title = 'ng-parallax-scroll';

  constructor(private parallaxService: NgxParallaxScrollService) {}

  pConfig: NgxParallaxScrollConfig = {
    speed: 1,
    identifier: 'tomato',
    direction: 'reverse',
  };

  partialConfig: NgxParallaxScrollConfig = {
    direction: 'reverse',
  };

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.parallaxService.getInstances());
    setTimeout(() => {
      // this.parallaxService.disableParallaxScroll('tomato');
    }, 2000);

    setTimeout(() => {
      // this.parallaxService.enableParallaxScroll('0');
      // console.log(this.parallaxService.getInstance('0'));
    }, 7000);
  }
}
