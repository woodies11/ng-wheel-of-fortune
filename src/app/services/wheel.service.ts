import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WheelService {
  private _spinDurationSeconds = 8;
  public get spinDurationSeconds(): number {
    return this._spinDurationSeconds;
  }
  public set spinDurationSeconds(v: number) {
    if (typeof v !== 'number' || v < 1) {
      return;
    }
    this._spinDurationSeconds = v;
    localStorage.setItem('config.spinDuration', String(v));
  }

  public isRotating = false;

  private _items: any[] = [];
  private get items(): any[] {
    return this._items;
  }
  private set items(v: any[]) {
    this._items = v;
    this.items$.next(this.items);
  }
  public items$ = new BehaviorSubject(this.items);

  private _recentlyRemovedItems: any[] = [];
  private get recentlyRemovedItems(): any[] {
    return this._recentlyRemovedItems;
  }
  private set recentlyRemovedItems(v: any[]) {
    this._recentlyRemovedItems = v;
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
  }
  public recentlyRemovedItems$ = new BehaviorSubject(this.recentlyRemovedItems);

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
    // Load items from localStorage
    const localStorageItems = JSON.parse(localStorage.getItem('wheelItems'));
    if (Array.isArray(localStorageItems)) {
      this.items = localStorageItems;
    }
    this.items$.subscribe((its) => {
      localStorage.setItem('wheelItems', JSON.stringify(its));
    });

    // Load recently removed items from localStorage
    const localStorageRecentlyRemovedItems = JSON.parse(
      localStorage.getItem('recentlyRemovedItems')
    );
    if (Array.isArray(localStorageRecentlyRemovedItems)) {
      this.recentlyRemovedItems = localStorageRecentlyRemovedItems;
    }
    this.recentlyRemovedItems$.subscribe((rrits) => {
      localStorage.setItem('recentlyRemovedItems', JSON.stringify(rrits));
    });

    // Load other configs from localStorage
    this.spinDurationSeconds = +localStorage.getItem('config.spinDuration');
  }

  public addItem(i: any): void {
    this.items.push(i);
    this.items$.next(this.items);
  }

  public removeItem(index: number): void {
    const deleted = this.items.splice(index, 1);
    this.items$.next(this.items);
    this.recentlyRemovedItems.push(...deleted);
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
  }

  public removeAll(): void {
    this.recentlyRemovedItems.push(...this.items);
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
    this.items = [];
  }

  public removeWinningOption(): void {
    if (this.currentWinningIndex < 0) {
      return;
    }
    this.removeItem(this.currentWinningIndex);
  }

  public removeRecentlyRemovedItem(index: number): void {
    this.recentlyRemovedItems.splice(index, 1);
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
  }

  public addBackFromRecentlyRemoved(indexOfRecentlyRemovedArray: number): void {
    const toAddBack = this._recentlyRemovedItems.splice(
      indexOfRecentlyRemovedArray,
      1
    );
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
    toAddBack.forEach((it) => this.addItem(it));
  }

  public addAllRecentlyRemovedBack(): void {
    this.items.push(...this.recentlyRemovedItems);
    this.items$.next(this.items);
    this.recentlyRemovedItems = [];
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
  }

  public removeAllRecentlyRemoved(): void {
    this.recentlyRemovedItems = [];
    this.recentlyRemovedItems$.next(this.recentlyRemovedItems);
  }
}
