import {NumberChartCardDataModel} from '../../models/charts-data.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/services/statistics.service';
import {forkJoin, Subject} from "rxjs";
import {CommitService} from "../../services/commit.service";
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import {StateService} from "../../services/state.service";
import {MatSelectChange} from "@angular/material/select";

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CommitEventTypeEnum} from "../../models/commit-data.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy{
  public commitTimeBarChartType: ChartType = 'bar';
  public commitTimeBarChartLegend = true;
  public commitTimeBarChartPlugins = [DataLabelsPlugin ];
  public commitTimeBarChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
      }
    }
  };
  public commitTimeBarChartLabels: string[] = [];
  public commitTimeBarChartData: ChartDataset[] = [];

  /**
   * The data to be displayed
   */
  public numberCardsData: NumberChartCardDataModel[] = [];

  public availableUsers: string[] = [];

  public averageTime: any[] = [];

  public cardColor: string = '#232837';

  private _destroy$ = new Subject();

  constructor(private statisticsService: StatisticsService,
              private commitService: CommitService,
              private stateService: StateService) {}

  public ngOnInit(): void {
    this._numberChartDataInit();
    this._getUsers();
    this._getAverageTime();
  }

  /**
   * Converts data to Numbers Card data model
   */
  private _numberChartDataInit(): void {
    let data: NumberChartCardDataModel[] = [];
    forkJoin(
      [
        this.statisticsService.getTotalCommits(),
        this.statisticsService.getTotalPass(),
        this.statisticsService.getTotalPassRate(),
      ]).subscribe((response) => {
        data.push(
          {
            name: 'Total commits',
            value: response[0]
          },
          {
            name: 'Total passes',
            value: response[1]
          },
          {
            name: 'Total pass rate',
            value: response[2],
            unit: "%"
          }
        )
        this.numberCardsData =  data;
      });
  }

  /**
   * Gets the users list
   * @private
   */
  private _getUsers(): void {
    this.commitService.getAllUsers()
      .subscribe((response) => {
        this.availableUsers = response;
      })
  }

  private _getAverageTime(): void {
    this.statisticsService.getAverageTime()
      .subscribe((response) => {
        this.averageTime = response;
        this.commitTimeBarChartLabels = this.averageTime.map(commit => 'Commit #'+ commit.commit_id);
        this.commitTimeBarChartData = this._barChartDataBuilder(response);
      })
  }

  private _barChartDataBuilder(data: any): ChartDataset[] {
      let result: ChartDataset[] = [];
      let allEvents = {
        pull: [],
        patch: [],
        build: [],
        sanity: [],
        review: [],
        merge: [],
      };
      data.forEach((commit: any) => {
        Object.entries(allEvents).forEach(([key, value]) =>  {
          let filteredEvents = commit.events.filter((event: any) => {
            if (event.name === key) {
              // @ts-ignore
              allEvents[key].push(event.time)
              return key;
            } else {
              return null;
            }
          });
          if (filteredEvents.length === 0) {
            // @ts-ignore
            allEvents[key].push(undefined);
          }
        });
      })
    Object.entries(allEvents).forEach(([key, value]) =>  {
      result.push({
        data: value,
        label: key,
        stack: 'a'
      })
    });
    return result;
  }

  /**
   * Filters the data regarding the selected user
   * @param user
   */
  public filterUser(user: MatSelectChange) {
    if (user.value) {
      this.stateService.currentlySelectedUser = user.value;
    } else {
      this.stateService.currentlySelectedUser = '';
    }
    this._numberChartDataInit();
    this._getUsers();
    this._getAverageTime();
  }



  /**
   * Destroys the component
   */
  public ngOnDestroy(): void {
    this._destroy$.next(undefined);
    this._destroy$.complete();
  }
}

