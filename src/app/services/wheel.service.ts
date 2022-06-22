import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WheelService {
  private items: any[] = [];
  public items$ = new BehaviorSubject(this.items);

  constructor() {}

  public addItem(i: any): void {
    this.items.push(i);
    this.items$.next(this.items);
  }

  public removeItem(index: number): void {
    this.items.splice(index, 1);
    this.items$.next(this.items);
  }
}
