import { Component, OnInit } from '@angular/core';
import { WheelService } from 'src/app/services/wheel.service';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss'],
})
export class ResultDialogComponent implements OnInit {
  constructor(public wheelService: WheelService) {}

  ngOnInit(): void {}

  public removeWinningOption(): void {
    this.wheelService.removeWinningOption();
  }
}
