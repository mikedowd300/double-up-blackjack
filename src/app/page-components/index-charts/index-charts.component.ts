import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';
import { LoaderComponent } from '../../shared-components/loader/loader.component';
import { DeviationEngine } from '../../deviation-engine/deviation-engine';
import { LocalStorageService } from '../../services/local-storage.service';
import { AccordionComponent } from '../../shared-components/accordion/accordion.component';

@Component({
  selector: 'index-charts',
  standalone: true,
  imports: [ AccordionComponent, CommonModule, FormsModule, LoaderComponent, RouterLink, RouterLinkActive ],
  templateUrl: './index-charts.component.html',
  styleUrl: './index-charts.component.scss',
})

export class IndexChartsComponent implements OnInit {
  instructionDetail: boolean[] = [false, false, false, false, false, false, false];

  constructor(
    public vmService: ViewModelService,
    public engine: DeviationEngine, 
  ) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
  }

  expand(index: number): void {
    if(this.instructionDetail[index]) {
      this.instructionDetail[index] = false;
    } else {
      this.instructionDetail = [false, false, false, false, false, false, false];
      this.instructionDetail[index] = true;
    }
  }
}