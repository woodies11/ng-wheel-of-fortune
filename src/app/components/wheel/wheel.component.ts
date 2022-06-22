import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WheelService } from 'src/app/services/wheel.service';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent implements AfterViewInit {
  @ViewChild('thewheel') theWheelRef: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(public wheelService: WheelService) {}

  private colors = ['#f82', '#0bf', '#fb0', '#0fb', '#b0f', '#f0b'];

  ngAfterViewInit(): void {
    this.ctx = this.theWheelRef.nativeElement.getContext('2d');
    this.wheelService.items$.subscribe((items) => {
      const numOfItems = items.length;
      const diameter = this.ctx.canvas.width;
      const radius = diameter / 2;
      const sliceAngleRad = (2 * Math.PI) / numOfItems;
      console.log({
        numOfItems,
        diameter,
        radius,
        sliceAngleRad,
      });
      items.forEach((item, index) => {
        const startingAngleRad = sliceAngleRad * index;
        const endAngleRad = startingAngleRad + sliceAngleRad;
        this.ctx.save();

        // Draw a slice
        // ---------------------------------------------------
        this.ctx.beginPath();

        // prevent the case where the last item added have the same
        // color as the first item
        if (index > 0 && index % this.colors.length === 0) {
          this.ctx.fillStyle = '#bf0';
        } else {
          this.ctx.fillStyle = this.colors[index % this.colors.length];
        }
        // move cursor to center of circle
        this.ctx.moveTo(radius, radius);
        this.ctx.arc(radius, radius, radius, startingAngleRad, endAngleRad);
        // move back to center
        this.ctx.lineTo(radius, radius);
        this.ctx.fill();

        // Draw text
        // ---------------------------------------------------
        this.ctx.translate(radius, radius);
        this.ctx.rotate(startingAngleRad + sliceAngleRad / 2);
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 30px sans-serif';
        this.ctx.fillText(item, radius - 10, 10);

        this.ctx.restore();
      });
    });
  }
}
