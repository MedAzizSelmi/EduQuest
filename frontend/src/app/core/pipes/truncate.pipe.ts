import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, trail: string = '...'): string {
    return value.length > limit
      ? value.substring(0, limit) + trail
      : value;
  }
}
