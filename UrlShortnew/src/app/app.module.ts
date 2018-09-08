import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { UrlCreateComponent } from './url-create/url-create.component';
import { UrlAnalyticalsComponent } from './url-analyticals/url-analyticals.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { AmChartsModule } from "amcharts3-angular2";



import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule
} from "@angular/material";

const appRoutes: Routes = [
  {
    path: 'url-create',
    component: UrlCreateComponent,
    data: { title: 'url-create' }
  },
  {
    path: 'url-analyticals/:id',
    component: UrlAnalyticalsComponent,
    data: { title: 'url-analyticals' }
  },
  {
    path: '',
    redirectTo: '/url-create',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UrlCreateComponent,
    UrlAnalyticalsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CalendarModule,
    AmChartsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
