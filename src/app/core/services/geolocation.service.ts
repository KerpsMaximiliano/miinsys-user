import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';

// * Interfaces.
import {
  ICoordinates,
  IGeoAddress,
  IGeoError,
  IGeoPosition,
} from '../interfaces/geolocation.interface';

// * Material.
import { MatDialog } from '@angular/material/dialog';

// * Components.
import { LocationModalComponent } from 'src/app/core/components/location-modal/location-modal.component';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private direction: string = '';
  private url: string = 'https://nominatim.openstreetmap.org/';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  public get(): string {
    return this.direction;
  }

  public set(): void {
    navigator.geolocation.getCurrentPosition(
      (res: IGeoPosition) => {
        this.handleGeo(res.coords);
      },
      (err: IGeoError) => {
        switch (err.code) {
          case 1:
            this.openModal();
            break;
          case 2:
            break;
          case 3:
            break;
          default:
            break;
        }
        console.log(`Status Code ${err.code}: ${err.message}`, 'error');
      }
    );
  }

  private handleGeo(position: ICoordinates): void {
    this.getAddressFromCoordinates(
      position.latitude,
      position.longitude
    ).subscribe({
      next: (res: any) => {
        console.log('geoAddress:', res);
        this.direction = `${res.address.county}, ${res.address.country}.`;
      },
      error: (err: any) => {
        console.log('geoAddress:', err);
      },
      complete: () => {},
    });
  }

  private getAddressFromCoordinates(
    lat: number,
    lon: number
  ): Observable<IGeoAddress> {
    const url = `${this.url}reverse?lat=${lat}&lon=${lon}&format=json`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<IGeoAddress>(url, { headers });
  }

  private openModal(): void {
    this.dialog.open(LocationModalComponent, {
      maxHeight: '85vh',
      height: 'auto',
    });
  }
}
