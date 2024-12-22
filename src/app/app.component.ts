import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BetSpreadComponent } from './page-components/customizations/bet-spread/bet-spread.component';
import { ConditionsComponent } from './page-components/customizations/conditions/conditions.component';
import { CountingComponent } from './page-components/customizations/counting/counting.component';
import { CustomizationsPageComponent } from './page-components/customizations/customizations.component';
import { DashboardComponent } from './page-components/dashboard/dashboard.component';
import { EditDataComponent } from './page-components/index-charts/edit-data/edit-data.component';
import { SimDataComponent } from './page-components/index-charts/sim-data/sim-data.component';
import { IndexChartsComponent } from './page-components/index-charts/index-charts.component';
import { HeaderNavComponent } from './shared-components/header-nav/header-nav.component';
import { HomePageComponent } from './page-components/home/home.component';
import { InsuranceComponent } from './page-components/customizations/insurance/insurance.component';
import { LoaderComponent } from './shared-components/loader/loader.component';
import { PlayChartComponent } from './page-components/customizations/play-chart/play-chart.component';
import { PlayerComponent } from './page-components/customizations/player/player.component';
import { SimulationPageComponent } from './page-components/simulation/simulation.component';
import { TableComponent } from './page-components/customizations/table/table.component';
import { TippingComponent } from './page-components/customizations/tipping/tipping.component';
import { UnitResizingComponent } from './page-components/customizations/unit-resizing/unit-resizing.component';
import { VisualizeDataComponent } from './page-components/index-charts/visualize-data/visualize-data.component';
import { WongingComponent } from './page-components/customizations/wonging/wonging.component';
import { PracticeComponent } from './page-components/practice/practice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BetSpreadComponent,
    ConditionsComponent,
    CountingComponent,
    CustomizationsPageComponent,
    DashboardComponent,
    EditDataComponent,
    HeaderNavComponent,
    IndexChartsComponent,
    InsuranceComponent,
    HomePageComponent,
    LoaderComponent,
    PlayChartComponent,
    PlayerComponent,
    PracticeComponent,
    RouterOutlet,
    SimDataComponent,
    SimulationPageComponent,
    TableComponent,
    TippingComponent,
    UnitResizingComponent,
    VisualizeDataComponent,
    WongingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor() {}
}
