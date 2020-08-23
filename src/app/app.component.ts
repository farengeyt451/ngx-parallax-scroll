import {
  Component,
  AfterContentInit,
  AfterViewInit,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
import { NgxParallaxScrollConfig, StateChanges } from 'projects/ngx-parallax-scroll/src/public-api';
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

  config: NgxParallaxScrollConfig = {
    speed: 1,
    identifier: 'tomato',
    direction: 'reverse',
    isWillChangeEnabled: false,
  };

  partialConfig: NgxParallaxScrollConfig = {
    speed: 2,
  };

  ngOnInit() {
    this.subToInstancesChange();
  }

  private subToInstancesChange() {
    this.parallaxService.stateChanges.subscribe((data: StateChanges) => {
      console.log('InstancesChanges', data);
    });
  }

  ngAfterViewInit() {
    console.log(this.parallaxService.getInstances());
    // setTimeout(() => {
    //   this.parallaxService.disable('tomato');
    // }, 2000);
    // setTimeout(() => {
    //   this.parallaxService.enable('tomato');
    // }, 7000);
  }
}
