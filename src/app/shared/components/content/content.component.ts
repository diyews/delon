import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MetaService, MobileService } from '@core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  host: {
    '[class.main-wrapper]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isMobile!: boolean;
  opened = false;

  constructor(public meta: MetaService, private mobileSrv: MobileService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.mobileSrv.change.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.isMobile = res;
      this.cdr.detectChanges();
    });
  }

  to(): void {
    this.opened = false;
  }

  ngOnDestroy(): void {
    const { destroy$ } = this;
    destroy$.next();
    destroy$.complete();
  }
}
