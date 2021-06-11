import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { FooterComponent } from './footer/footer.component';
import { ContributeRequestComponent } from './contribute-request/contribute-request.component';
//import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RequestsListComponent,
    DashboardComponent,
    AboutComponent,
    ViewRequestComponent,
    ContributeRequestComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MaterialModule,
    HttpClientModule,
  //  RecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ViewRequestComponent, ContributeRequestComponent]

})
export class AppModule { }
