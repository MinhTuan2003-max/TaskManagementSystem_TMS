import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format: string = 'medium'): string {
    if (!value) return '';

    const date = new Date(value);

    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'medium':
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'long':
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  }
}
