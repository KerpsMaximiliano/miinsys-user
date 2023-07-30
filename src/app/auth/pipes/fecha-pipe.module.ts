import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'fecha'})
export class FechaPipe implements PipeTransform {
  transform(date: string): string {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  }
};