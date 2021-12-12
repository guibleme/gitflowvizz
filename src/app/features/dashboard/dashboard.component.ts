import {NumberChartCardDataModel} from '../../models/charts-data.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/services/statistics.service';
import {Subject} from "rxjs";
import {CommitService} from "../../services/commit.service";
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy{
  public commitTimeBarChartType: ChartType = 'bar';
  public commitTimeBarChartLegend = true;
  public commitTimeBarChartPlugins = [];
  public commitTimeBarChartLabels: string[] = [];
  public commitTimeBarChartData: ChartDataset[] = [];
  public commitTimeBarChartOptions: ChartOptions = {
    responsive: true,
  };

  /**
   * The data to be displayed
   */
  public numberCardsData: NumberChartCardDataModel[] = [];

  public availableUsers: string[] = [];

  public averageTime: any[] = [];

  public cardColor: string = '#232837';

  private _destroy$ = new Subject();

  constructor(private statisticsService: StatisticsService,
              private commitService: CommitService) {}

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

    data.push(
      {
        name: 'Total commits',
        value: this.statisticsService.getTotalCommits()
      },
      {
        name: 'Total passes',
        value: this.statisticsService.getTotalPass()
      },
      {
        name: 'Total pass rate',
        value: this.statisticsService.getTotalPassRate(),
        unit: "%"
      }
    )

    this.numberCardsData =  data;
  }

  /**
   * Gets the users list
   * @private
   */
  private _getUsers(): void {
    this.availableUsers =  this.commitService.getAllUsers();
  }

  private _getAverageTime(): void {
    this.averageTime = this.statisticsService.getAverageTime();

    this.commitTimeBarChartOptions = {
        responsive: true,
      };
    this.commitTimeBarChartType = 'bar';
    this.commitTimeBarChartLegend = true;
    this.commitTimeBarChartPlugins = [];
    this.commitTimeBarChartLabels = this.averageTime.map(commit => 'Commit #'+ commit.commit_id);
    this.commitTimeBarChartData = [
      {data: this.averageTime.map(commit => commit.commitLifeTime), label: 'Life in hours'}
    ]
  }


  /**
   * Destroys the component
   */
  public ngOnDestroy(): void {
    this._destroy$.next(undefined);
    this._destroy$.complete();
  }
}

