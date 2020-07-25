import { Component } from '@angular/core';
import { ParallaxScrollConfig } from 'projects/ngx-parallax-scroll/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'ng-parallax-scroll';

  pConfig: ParallaxScrollConfig = {};
}
