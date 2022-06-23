import { Component } from '@angular/core';
import { EasterEggListService } from './services/easter-egg-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public easterEggListService: EasterEggListService) {}
}
