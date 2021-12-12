import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CommitEventTypePipe } from './pipes/commit-event-type.pipe';
import { CommitStatusPipe } from './pipes/commit-status.pipe';
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatMenuModule} from "@angular/material/menu";
import { NgChartsModule } from 'ng2-charts';
import {NgxEchartsModule} from "ngx-echarts";
import {GanttChartModule} from "iamferraz-gantt-chart";
import {GanttComponent} from "./features/gantt/gantt.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CommitEventTypePipe,
    CommitStatusPipe,
    GanttComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    GanttChartModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
