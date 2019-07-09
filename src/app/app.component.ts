import { Component } from '@angular/core';
import { IParallaxScrollConfig } from 'projects/ngx-parallax-scroll/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'ng-parallax-scroll';
  ngParallaxConf: IParallaxScrollConfig = {
    parallaxSpeed: 1,
    parallaxSmoothness: 1,
    parallaxDirection: 'reverse'
  };
}
