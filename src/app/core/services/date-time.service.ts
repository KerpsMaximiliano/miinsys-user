import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * Servicio que configura la fecha y hora.
 */
export class DateTimeService {
  /**
   * Retorna la fecha y hora del usuario local.
   * @returns Date: representa la hora del usuario menos el GMT del usuario.
   */
  public setDateGTM(): Date {
    let date = new Date();
    let hours = date.getHours();
    let gmt = date.getTimezoneOffset() / 60;
    gmt > 0 ? (hours -= gmt) : (hours += gmt);
    date = new Date(date.setHours(hours));
    return date;
  }

  /**
   * Retorna la fecha y hora del usuario con el formato: DD-MM-YYYY, HH:MM
   * @returns string: representa la fecha y hora del usuario.
   */
  public getDateTime(): string {
    return `${this.getDate()}, ${this.getTime()}`;
  }

  /**
   * Retorna la fecha del usuario local en formato: DD-MM-YYYY
   * Añade un 0 si son menos de 10 dias para dar el formato 0D.
   * Añade un 0 si son menos de 10 meses para dar el formato 0M.
   * Opcionalmente puede recibir una fecha.
   * @returns string: representa la fecha del dispositivo del usuario.
   */
  public getDate(d?: any): string {
    let date;
    d ? (date = d) : (date = new Date());

    let year: string = date.getFullYear();

    let day: string | number = date.getDate();
    if (date.getDate() < 10) day = `0${date.getDate()}`;

    let month: string | number = date.getMonth() + 1;
    if (date.getMonth() < 9) month = `0${date.getMonth() + 1}`;

    return `${day} - ${month} - ${year}`;
  }

  /**
   * Retorna la hora del usuario local en formato: HH:MM.
   * Añade un 0 si son menos de 10 horas para dar el formato 0H.
   * Añade un 0 si son menos de 10 minutos para dar el formato 0M.
   * @returns string: representa la hora del dispositivo del usuario.
   */
  public getTime(): string {
    let date = new Date();

    let hours: string | number = date.getHours();
    if (date.getHours() < 10) hours = `0${date.getHours()}`;

    let minutes: string | number = date.getMinutes();
    if (date.getMinutes() < 10) minutes = `0${date.getMinutes()}`;

    return `${hours}:${minutes}`;
  }
}
