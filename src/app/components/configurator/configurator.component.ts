import { Component, OnInit } from '@angular/core';
import { WheelService } from 'src/app/services/wheel.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss'],
})
export class ConfiguratorComponent implements OnInit {
  public currentItemValue = '';

  constructor(public wheelService: WheelService) {}

  public addItem(): void {
    this.wheelService.addItem(this.currentItemValue);
    this.currentItemValue = '';
  }

  public removeItem(index: number): void {
    this.wheelService.removeItem(index);
  }

  ngOnInit(): void {}
}
