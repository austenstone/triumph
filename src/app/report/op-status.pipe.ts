import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'opStatus'
})
export class OpStatusPipe implements PipeTransform {

  transform(value: any): unknown {
    if (value == 0) {
      return 'LOW';
    } else if (value == 1) {
      return 'OK';
    } else if (value == 2) {
      return 'HIGH';
    }

    return 'Unknown';
  }

}

@Pipe({
  name: 'opStatus2'
})
export class OpStatusPipe2 implements PipeTransform {

  transform(value: any): unknown {
    if (value == 0) {
      return 'NOK';
    } else if (value == 1) {
      return 'OK';
    }

    return 'Unknown';
  }

}
