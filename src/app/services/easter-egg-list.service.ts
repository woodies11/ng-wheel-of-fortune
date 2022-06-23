import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EASTER_EGG_LIST } from '../assets/easter-egg-list';
import { WheelService } from './wheel.service';

@Injectable({
  providedIn: 'root',
})
export class EasterEggListService {
  private readonly SALT = 'fa02abf7a0361928';
  private isFirstEvaluation = true;

  public shouldEnableS1$ = new BehaviorSubject(false);

  constructor(private wheelService: WheelService) {
    this.init();
  }

  private init(): void {
    combineLatest([
      this.wheelService.items$,
      this.wheelService.recentlyRemovedItems$,
    ])
      .pipe(
        map(([i, r]) => {
          return i.concat(r);
        })
      )
      .subscribe((allItems) => {
        if (
          (!this.isFirstEvaluation && allItems.length > 10) ||
          allItems.length > 30
        ) {
          return;
        }
        this.isFirstEvaluation = false;

        let matchCount = 0;
        allItems.forEach((item: string) => {
          this.hash(item?.toLowerCase()).then((hashed) => {
            if (EASTER_EGG_LIST.includes(hashed)) {
              matchCount++;
            }
            if (matchCount >= 4) {
              this.shouldEnableS1$.next(true);
            } else {
              this.shouldEnableS1$.next(false);
            }
          });
        });
      });
  }

  private async hash(str: string): Promise<string> {
    const utf8 = new TextEncoder().encode(str + this.SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }
}
