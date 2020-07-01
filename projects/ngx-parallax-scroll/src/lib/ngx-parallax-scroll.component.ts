import { Component, OnInit, Input } from '@angular/core';
import { ParallaxScrollConfig } from './ngx-parallax.interfaces';

@Component({
  selector: 'ngx-parallax-scroll',
  template: ` <div class="parallax-container" ngxParallaxScroll [parallaxProps]="config">
    <ng-content></ng-content>
  </div>`,
  styles: [`.parallax-container display: inline-block;`],
})
export class NgxParallaxScrollComponent implements OnInit {
  @Input() config: ParallaxScrollConfig;

  constructor() {}

  ngOnInit() {}
}
