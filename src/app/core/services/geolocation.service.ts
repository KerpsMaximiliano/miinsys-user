import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Interfaces.
import {
  IGeoCoordinates,
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
  private direction: any;

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

  private handleGeo(position: IGeoCoordinates): void {
    this.getAddressFromCoordinates(
      position.latitude,
      position.longitude
    ).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  private getAddressFromCoordinates(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    return this.http.get(url);
  }

  private openModal(): void {
    this.dialog.open(LocationModalComponent, {
      maxHeight: '85vh',
      height: 'auto',
    });
  }
}
