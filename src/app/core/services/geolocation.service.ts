import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Interfaces.
import {
  ICoordinates,
  IGeoError,
  IGeoPosition,
} from '../interfaces/geolocation.interface';

// * Material.
import { MatDialog } from '@angular/material/dialog';

// * Components.
import { LocationModalComponent } from 'src/app/core/components/location-modal/location-modal.component';

interface GeolocationResult {
  success: boolean;
  lat: number | null;
  lon: number | null;
}

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

  public set(): Observable<GeolocationResult> {
    return new Observable<GeolocationResult>((observer) => {
      navigator.geolocation.getCurrentPosition(
        (res: IGeoPosition) => {
          this.handleGeo(res.coords);
          observer.next({
            success: true,
            lat: res.coords.latitude,
            lon: res.coords.longitude,
          });
          observer.complete();
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
          observer.next({
            success: false,
            lat: 0,
            lon: 0,
          });
          observer.complete();
        }
      );
    });
  }

  private handleGeo(position: ICoordinates): void {
    this.getAddressFromCoordinates(
      position.latitude,
      position.longitude
    ).subscribe({
      next: (res: any) => {
        const city =
          res.address?.city || res.address?.suburb || res.address?.town;
        const province =
          res.address?.province || res.address?.state || res.address?.county;
        const country = res.address?.country;

        this.direction = `${city}, ${province}, ${country}`;
      },
      error: (err: any) => {
        console.log('geoAddress:', err);
      },
      complete: () => {},
    });
  }

  private getAddressFromCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.url}reverse?lat=${lat}&lon=${lon}&format=json`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(url, { headers });
  }

  private openModal(): void {
    this.dialog.open(LocationModalComponent, {
      maxHeight: '85vh',
      height: 'auto',
    });
  }
}
