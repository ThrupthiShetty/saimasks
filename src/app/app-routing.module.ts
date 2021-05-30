import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RequestsListComponent } from './requests-list/requests-list.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'requests', component: RequestsListComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
