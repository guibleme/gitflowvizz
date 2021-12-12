import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commitEventType'
})
export class CommitEventTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
