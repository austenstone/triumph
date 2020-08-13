import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'opStatus'
})
export class OpStatusPipe implements PipeTransform {

  transform(value: number): unknown {
    if (value === 0) {
      return 'Unknown';
    } else if (value === 1) {
      return 'Unknown';
    } else if (value === 2) {
      return 'Unknown';
    }

    return 'Unknown';
  }

}
