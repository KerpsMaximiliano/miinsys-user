import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


export class AuthGuard implements CanActivate {

    constructor() {}

    /*
        let user = sessionStorage.getItem('usuarioLogueado');
        if (!user) {
            user = localStorage.getItem('usuarioRecordar');
        }
        if(!user) {
            return false;
        } else {
            return true;
        }
    */
    
    

    canActivate() {
        console.log("AlwaysAuthGuard");
        //return true;
        let user = sessionStorage.getItem('usuarioLogueado');
        if (!user) {
            user = localStorage.getItem('usuarioRecordar');
        }
        if(!user) {
            return false;
        } else {
            return true;
        }
    }
}