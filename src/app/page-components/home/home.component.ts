import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomePageComponent implements OnInit {

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
  }
}