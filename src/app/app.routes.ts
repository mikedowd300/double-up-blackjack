import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { ViewModelService } from './services/view-model.service';
import { BankrollChartComponent } from './page-components/dashboard/bankroll-chart/bankroll-chart.component';
import { BetSpreadComponent } from './page-components/customizations/bet-spread/bet-spread.component';
import { ConditionsComponent } from './page-components/customizations/conditions/conditions.component';
import { CountingComponent } from './page-components/customizations/counting/counting.component';
import { CustomizationsPageComponent } from './page-components/customizations/customizations.component';
import { DashboardComponent } from './page-components/dashboard/dashboard.component';
import { EditDataComponent } from './page-components/index-charts/edit-data/edit-data.component';
import { IndexChartsComponent } from './page-components/index-charts/index-charts.component';
import { HomePageComponent } from './page-components/home/home.component';
import { InsuranceComponent } from './page-components/customizations/insurance/insurance.component';
import { PlayChartComponent } from './page-components/customizations/play-chart/play-chart.component';
import { PlayerComponent } from './page-components/customizations/player/player.component';
import { ReplayComponent } from './page-components/dashboard/replay/replay.component';
import { RoiChartsComponent } from './page-components/dashboard/roi-charts/roi-charts.component';
import { SimDataComponent } from './page-components/index-charts/sim-data/sim-data.component';
import { SimulationPageComponent } from './page-components/simulation/simulation.component';
import { TableComponent } from './page-components/customizations/table/table.component';
import { TippingComponent } from './page-components/customizations/tipping/tipping.component';
import { UnitResizingComponent } from './page-components/customizations/unit-resizing/unit-resizing.component';
import { VisualizeDataComponent } from './page-components/index-charts/visualize-data/visualize-data.component';
import { WongingComponent } from './page-components/customizations/wonging/wonging.component';
import { PracticeComponent } from './page-components/practice/practice.component';

const canMatchDashboard: CanMatchFn = () => {
  const service = inject(ViewModelService);
  const router = inject(Router);
  return service.getAllowNavigationToDashboard()
    ? true
    : new RedirectCommand(router.parseUrl('/simulation'));
};

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'customizations',
    component: CustomizationsPageComponent,
  },
  {
    path: 'simulation',
    component: SimulationPageComponent,
  },
  {
    path: 'index-charts',
    component: IndexChartsComponent,
  },
  {
    path: 'sim-data',
    component: SimDataComponent,
  },
  {
    path: 'visualize-data',
    component: VisualizeDataComponent,
  },
  {
    path: 'edit-data',
    component: EditDataComponent,
  },
  {
    path: 'conditions',
    component: ConditionsComponent,
  },
  {
    path: 'bet-spread',
    component: BetSpreadComponent,
  },
  {
    path: 'counting',
    component: CountingComponent,
  },
  {
    path: 'play-chart',
    component: PlayChartComponent,
  },
  {
    path: 'player',
    component: PlayerComponent,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: 'tipping',
    component: TippingComponent,
  },
  {
    path: 'unit-resizing',
    component: UnitResizingComponent,
  },
  {
    path: 'wonging',
    component: WongingComponent,
  },
  {
    path: 'insurance',
    component: InsuranceComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canMatch: [canMatchDashboard],
  },
  {
    path: 'bankroll-chart',
    component: BankrollChartComponent,
  },
  {
    path: 'replay',
    component: ReplayComponent,
  },
  {
    path: 'roi-charts',
    component: RoiChartsComponent,
  },
  {
    path: 'practice',
    component: PracticeComponent,
  }
];