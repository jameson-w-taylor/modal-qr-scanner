import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ScannerPage } from './scanner/scanner.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'scanner',
    component: ScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
