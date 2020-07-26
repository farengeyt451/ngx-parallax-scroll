import {
  Component,
  AfterContentInit,
  AfterViewInit,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
import { NgxParallaxScrollConfig } from 'projects/ngx-parallax-scroll/src/public-api';
import { NgxParallaxScrollService } from 'projects/ngx-parallax-scroll/src/lib/ngx-parallax-scroll.service';

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
  };

  ngOnInit() {}

  ngAfterViewInit() {}
}
