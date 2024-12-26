import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'accordion',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})

export class AccordionComponent implements OnDestroy, OnInit {
  @Input() expanded: boolean = false;
  @Input() title: string = null;
  @Input() expand$: Observable<boolean> = of(false);
  private destroy$: Subject<boolean> = new Subject();

  public accordionExpand: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.expand$.pipe(takeUntil(this.destroy$)).subscribe(ex => this.accordionExpand = ex)
  }

  expand() {
    this.accordionExpand = !this.accordionExpand
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}