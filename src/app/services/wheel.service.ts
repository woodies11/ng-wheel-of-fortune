import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WheelService {
  private _items: any[] = [];
  private get items(): any[] {
    return this._items;
  }
  private set items(v: any[]) {
    this._items = v;
    this.items$.next(this._items);
  }
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

  constructor() {
    this.init();
  }

  init(): void {
    const localStorageItems = JSON.parse(localStorage.getItem('wheelItems'));
    if (Array.isArray(localStorageItems)) {
      this.items = localStorageItems;
    }
    this.items$.subscribe((items) => {
      localStorage.setItem('wheelItems', JSON.stringify(items));
    });
  }

  public addItem(i: any): void {
    this.items.push(i);
    this.items$.next(this.items);
  }

  public removeItem(index: number): void {
    this.items.splice(index, 1);
    this.items$.next(this.items);
  }

  public removeAll(): void {
    this.items = [];
  }

  public removeWinningOption(): void {
    if (this.currentWinningIndex < 0) {
      return;
    }
    this.removeItem(this.currentWinningIndex);
  }
}
