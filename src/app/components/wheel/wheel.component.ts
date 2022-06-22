import { Component, OnInit } from '@angular/core';
import { WheelService } from 'src/app/services/wheel.service';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent implements OnInit {
  constructor(public wheelService: WheelService) {}

  ngOnInit(): void {}
}
