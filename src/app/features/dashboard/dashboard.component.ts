import {NumberChartCardDataModel} from '../../models/charts-data.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatisticsService} from 'src/app/services/statistics.service';
import {forkJoin, startWith, Subject} from "rxjs";
import {CommitService} from "../../services/commit.service";
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import {StateService} from "../../services/state.service";
import {MatSelectChange} from "@angular/material/select";

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CommitDataModel, CommitEventTypeEnum} from "../../models/commit-data.model";
import {TaskModel} from "../../models/task-data.model";

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

  public commitGanttChartData: TaskModel[] = [];
  public commitPhaseGanttChartData: TaskModel[] = [];

  /**
   * The data to be displayed
   */
  public numberCardsData: NumberChartCardDataModel[] = [];

  public availableUsers: string[] = [];

  public commitStatistics: any[] = [];

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
        this.commitStatistics = response;
        this.commitTimeBarChartLabels = this.commitStatistics.map(commit => 'Commit #'+ commit.commit_id);
        this.commitTimeBarChartData = this._barChartDataBuilder(response);
         // this.commitGanttChartData = this._ganttChartDataBuilder(response);
        this.commitGanttChartData = this._ganttPhasesChartDataBuilder(response);
      })
  }

  /**
   * Builds the data groups for the bar chart
   * @param data
   * @private
   */
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

  private _ganttChartDataBuilder(data: any): TaskModel[] {
    let result: TaskModel[] = [];
    data.map((commit: any, index: number)  => {
      let commitData: TaskModel =  {
        groupName: commit.status? commit.status : commit.final_event === 'merge' ? 'success' : 'failed',
        groupOrder: index + 1,
        taskName: "Commit " + commit.commit_id,
        taskId: parseInt(commit.commit_id),
        start: commit.start_time,
        end: commit.end_time,
        taskDependencies: [],
        donePercentage: this._calculateCommitDonePercentage(commit.final_event),
        owner: commit.user,
        time: commit.commitLifeTime,
        status: commit.final_event,
        image: ''
      }
      result.push(commitData);
    })
    return result;
  }

  private _ganttPhasesChartDataBuilder(data: any): TaskModel[] {
    let result: TaskModel[] = [];
    data.map((commit: any, index: number)  => {
      commit.events.forEach((event: any) => {
        // @ts-ignore
        let commitOrder = commit.commit_id*10 + CommitEventTypeEnum[event.name];
        let commitData: TaskModel =  {
          groupName: "Commit " + commit.commit_id,
          groupOrder: parseInt(commitOrder),
          taskName: event.name,
          taskId: commit.commit_id + ' ' + event.name,
          start: event.start_time,
          end: event.end_time,
          taskDependencies: [],
          donePercentage: event.status === 'success' || event.status === 'approved' ? 100 : 0,
          owner: commit.user,
          time: event.time,
          event: event.name,
          status: event.status? event.status : event.name === 'merge' ? 'success' : 'failed',
          image: ''
        }
        result.push(commitData);
      })
    })
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

  private _calculateCommitDonePercentage(commitPhase: string): number {
    switch (commitPhase) {
      case 'pull':
        return 16.6;
      case 'patch':
        return 33.2;
      case 'build':
        return 49.8;
      case 'sanity':
        return 66.4;
      case 'review':
        return 83;
      case 'merge':
        return 100;
      default:
        return 0;
    }
  }


  /**
   * Destroys the component
   */
  public ngOnDestroy(): void {
    this._destroy$.next(undefined);
    this._destroy$.complete();
  }
}

