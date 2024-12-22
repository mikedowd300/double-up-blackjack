import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';

@Component({
  selector: 'header-nav',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss'
})

export class HeaderNavComponent implements OnInit {

  title: string = "Dominate Double Up Blackjack";

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {}
}