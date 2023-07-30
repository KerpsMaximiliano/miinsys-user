import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {LoginData, LoginForm, RegisterData} from '../interfaces/login.interfaces';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient,
    private router: Router,
    ) {}


  login( formData : LoginForm ) {
    return of(1).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', '13asdasd123asd' )
      }),(tap( (resp: any) => {
        sessionStorage.setItem('usuarioLogueado', JSON.stringify(formData));
      }))
    );
  }

  checkTokenExpiration() {
    if(localStorage.getItem('tokenExpiration') == null || new Date(localStorage.getItem('tokenExpiration')!) < new Date()) {
      this.logout();
      this.router.navigateByUrl('/login');
    }
  }

  getCuestionarios()
  {
    return of(1).pipe();
  }
  logout()
  {
    localStorage.removeItem('usuarioRecordar');
    localStorage.removeItem('token');
    sessionStorage.removeItem('usuarioLogueado');
    sessionStorage.removeItem('usuarioDatos');
    localStorage.removeItem('tokenExpiration');
    sessionStorage.removeItem('currentTree');
  }

  loginBackend(login: LoginData, remember: boolean): Observable<any> {
    return this.http.post<any>(`${environment.base_url}Authenticate/login`, login)
      .pipe(
        tap( (res: any) => {
          localStorage.setItem('token', res.token);
          if(!res.firstLogin) {
            if(remember) {
              localStorage.setItem('usuarioRecordar',  JSON.stringify(login));
            }
            localStorage.setItem('token', res.token);
            localStorage.setItem('tokenExpiration', res.expiration);
            sessionStorage.setItem('usuarioLogueado', JSON.stringify(login));
            this.getUserData(Number(login.username)).subscribe(d => {
              sessionStorage.setItem('usuarioDatos', JSON.stringify(d));
            })
          }
        })
      )
  }

  getExtraInfo(token: any, remember: boolean): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${environment.base_url}Authenticate/GetUserExtraInfo`, {headers: headers})
      .pipe(
        tap((res: any) =>{
          if(res.usuarioRol.length > 0) {
            if(res.usuarioRol[0].id_rol == 3 || res.usuarioRol[0].id_rol == 2 || res.usuarioRol[0].id_rol == 4) {
              //Con rol adecuado
              let model = {
                username: res.rut,
                password: JSON.parse(sessionStorage.getItem('usuarioLogueado')!).password
              };
              sessionStorage.setItem('usuarioLogueado', JSON.stringify(model));
              if(remember) {
                localStorage.setItem('usuarioRecordar',  JSON.stringify(model));
              }
            } else {
              //Sin rol adecuado
              this.logout();
            }
          } else {
            //Sin rol adecuado
            this.logout();
          }
        })
      )
}

  recoverPassword(username: any): Observable<any> {
    return this.http.post<any>(`${environment.base_url}Account/forgotPassword`, username);
  }

  registerBackend(register: RegisterData): Observable<any> {
    return this.http.post<any>(`${environment.base_url}Authenticate/register`, register);
  }

  changePassword(login: LoginData): Observable<any> {
    return this.http.post<any>(`${environment.base_url}Account/changePassword`, login);
  }

  getMenuTree(username: string): Observable<any> {
    return this.http.get<any>(`${environment.base_url}ArbolMenu?username=${username}`);
  }

  getCuestionario(id: number): Observable<any> {
    return this.http.get<any>(`${environment.base_url}Cuestionario/GetEnabled?cue_id=${id}`);
  }

  postCuestionario(cuestionario: any): Observable<any> {
    return this.http.post<any>(`${environment.base_url}RespuestaCuestionario`, cuestionario);
  }

  getRespuesta(idRespuesta: number): Observable<any> {
    return this.http.get<any>(`${environment.base_url}RespuestaCuestionario?id_respuesta_cuestionario=${idRespuesta}`);
  }

  getPDF() {

  }

  uploadFile(archivo: File, rut:number, idCuestionario: number, idPregunta: number): Observable<any> {
    let formParams = new FormData();
    formParams.append('file', archivo);
    return this.http.post<any>(`${environment.base_url}RespuestaCuestionario/SubirArchivo?rut_id=${rut}&id_cuestionario=${idCuestionario}&id_pregunta=${idPregunta}`, formParams);
}

  getLocation(latitude: number, longitude: number) {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&addressdetails=1`, { responseType: 'text' });
  }

  getUserData(rut: number): Observable<any> {
    return this.http.get<any>(`${environment.base_url}Authenticate?rut=${rut}`);
  }

  getActividadById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.base_url}Actividad/GetByID?id_actividad=${id}`);
  }
}
