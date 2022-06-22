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
    if (!this.currentItemValue) {
      return;
    }
    const splitted = this.currentItemValue.split(',');
    for (const item of splitted) {
      this.wheelService.addItem(item.trim());
    }
    this.currentItemValue = '';
  }

  public removeItem(index: number): void {
    this.wheelService.removeItem(index);
  }

  ngOnInit(): void {}
}
