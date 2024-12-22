import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';
import { customizationLinks } from '../../models-constants-enums/constants';

@Component({
  selector: 'customizations',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './customizations.component.html',
  styleUrl: './customizations.component.scss'
})

export class CustomizationsPageComponent implements OnInit {

  customizationLinks = [ ...customizationLinks ];
  
  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
  }
}