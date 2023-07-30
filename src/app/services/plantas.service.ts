import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})

export class PlantasService {

    constructor(
        private http: HttpClient
    ) {}

    getPlantas(companyID: number): Observable<any> {
        return this.http.get<any>(`${environment.base_url}Planta?id_empresa=${companyID}`);
    }
}