import { CommitStatusTypeEnum } from './../models/commit-data.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commitStatus'
})
export class CommitStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
