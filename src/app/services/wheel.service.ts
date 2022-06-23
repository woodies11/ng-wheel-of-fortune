import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WheelService {
  private items: any[] = [];
  public items$ = new BehaviorSubject(this.items);

  private _currentWinningIndex = -1;

  public get currentWinningIndex(): number {
    return this._currentWinningIndex;
  }

  public get currentWinningValue(): any {
    if (this.currentWinningIndex < 0) {
      return '';
    }
    return this.items[this.currentWinningIndex];
  }

  public randomizeWinningIndex(): number {
    const numOfItems = this.items.length;
    this._currentWinningIndex = Math.floor(numOfItems * Math.random());
    return this._currentWinningIndex;
  }

  constructor() {}

  public addItem(i: any): void {
    this.items.push(i);
    this.items$.next(this.items);
  }

  public removeItem(index: number): void {
    this.items.splice(index, 1);
    this.items$.next(this.items);
  }

  public removeWinningOption(): void {
    if (this.currentWinningIndex < 0) {
      return;
    }
    this.removeItem(this.currentWinningIndex);
  }
}
