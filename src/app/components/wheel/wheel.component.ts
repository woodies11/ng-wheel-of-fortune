import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import confetti from 'canvas-confetti';
import { WheelService } from 'src/app/services/wheel.service';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent implements AfterViewInit {
  public rotationDegCSS = '0deg';
  public winningValue = '';
  private currentAngleDeg = 0;
  private dialogDelayTimer: any;

  @ViewChild('thewheel') theWheelRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('wheelcontainer') wheelContainerDevRef: ElementRef<HTMLDivElement>;
  private ctx: CanvasRenderingContext2D;

  constructor(
    public wheelService: WheelService,
    public matDialog: MatDialog,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar
  ) {}

  private colors = ['#f82', '#0bf', '#fb0', '#0fb', '#b0f', '#f0b'];

  rotate(): void {
    const numOfItems = this.wheelService.items$.value.length;

    if (numOfItems < 1) {
      this._snackBar.open('Please add something to the wheel first.', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    if (numOfItems === 1) {
      this._snackBar.open(`Fine...`, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

    this.wheelService.isRotating = true;

    const numberOfRotation = Math.floor(5 + 10 * Math.random());
    const winningItemIndex = this.wheelService.randomizeWinningIndex();
    const coef = this.currentAngleDeg > 0 ? -1 : 1;
    const meaninglessRotationDeg = coef * 360 * numberOfRotation;
    const sliceAngleDeg = 360 / numOfItems;

    const suspendRotationDeg =
      (Math.random() >= 0.5 ? -1 : 1) *
      Math.floor(0.5 * sliceAngleDeg * Math.random());

    this.currentAngleDeg =
      meaninglessRotationDeg +
      360 * ((numOfItems - winningItemIndex) / numOfItems) +
      suspendRotationDeg;
    this.rotationDegCSS = `rotate(${this.currentAngleDeg}deg)`;

    this.winningValue = this.wheelService.items$.value[winningItemIndex];
    if (this.dialogDelayTimer) {
      clearTimeout(this.dialogDelayTimer);
    }
    this.dialogDelayTimer = setTimeout(() => {
      this.matDialog.open(ResultDialogComponent);
      this.wheelService.isRotating = false;
      confetti({
        particleCount: this.randomInRange(400, 800),
        spread: this.randomInRange(200, 500),
        angle: this.randomInRange(55, 125),
        origin: { y: 0.5 },
      });
    }, this.wheelService.spinDurationSeconds * 1000 + 200);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.redrawCanvas();
  }

  ngAfterViewInit(): void {
    this.ctx = this.theWheelRef.nativeElement.getContext('2d');
    this.wheelService.items$.subscribe((items) => {
      this.redrawCanvas();
    });
  }

  private randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private redrawCanvas(): void {
    if (!this.ctx) {
      return;
    }

    const containerWidth = this.wheelContainerDevRef.nativeElement.offsetWidth;
    const wheelDiameter = containerWidth * 0.8;
    this.renderer.setAttribute(this.ctx.canvas, 'width', wheelDiameter + 'px');
    this.renderer.setAttribute(this.ctx.canvas, 'height', wheelDiameter + 'px');

    let items = this.wheelService.items$.value;

    if (items.length < 1) {
      items = ['please add something'];
    }
    const numOfItems = items.length;
    const diameter = this.ctx.canvas.width;
    const radius = diameter / 2;
    const sliceAngleRad = (2 * Math.PI) / numOfItems;
    items.forEach((item, index) => {
      const startingAngleRad = sliceAngleRad * index - sliceAngleRad / 2;
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
  }
}
