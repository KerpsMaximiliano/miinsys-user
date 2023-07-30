import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginData } from 'src/app/interfaces/login.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordDialog } from '../forgot-password-dialog/forgot-password-dialog.component';
import { FirstLoginDialog } from '../first-login-dialog/first-login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

   loginForm! : FormGroup;
   hiddenPassword: boolean = true;
   loading: boolean = false;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) 
  { 
    let user = sessionStorage.getItem('usuarioLogueado');
    if (!user) user = localStorage.getItem('usuarioRecordar');
    if(user) this.router.navigate(['/dashboard']);
  }
                 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      remember : [false]
    });
    if(localStorage.getItem('usuarioGuardadoUsuarios') != undefined) {
      this.loginForm.get('usuario')?.setValue(JSON.parse(localStorage.getItem('usuarioGuardadoUsuarios')!).username);
      this.loginForm.get('password')?.setValue(JSON.parse(localStorage.getItem('usuarioGuardadoUsuarios')!).password);
      this.loginForm.get('remember')?.setValue(true);
      this.loginForm.updateValueAndValidity();
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    let model: LoginData = {
      username: this.loginForm.get('usuario')!.value.toString(),
      password: this.loginForm.get('password')!.value,
    }

    this.usuarioService.loginBackend(model, this.loginForm.get('remember')!.value).subscribe(d => {
      localStorage.setItem('token', d.token);
      sessionStorage.setItem('usuarioLogueado', JSON.stringify(model));
      this.loading = false;
      this.usuarioService.getExtraInfo(d.token, this.loginForm.get('remember')!.value).subscribe(res => {
        if(res.usuarioRol.length > 0) {
          if(res.usuarioRol[0].id_rol > 1) {
            if (d.firstLogin) {
              const dialogRef = this.dialog.open(FirstLoginDialog, {
                width: '85%',
                height: '85%',
                data: { username: this.loginForm.get('usuario')!.value }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.loginForm.get('password')?.setValue(null);
                  if (result.status) {
                    this.openSnackBar(result.data, "Cerrar", "success-snackbar");
                  } else {
                    this.openSnackBar(result.data, "Cerrar", "error-snackbar");
                  }
                }
              });
            } else {
              if(this.loginForm.get('remember')?.value) {
                localStorage.setItem('usuarioGuardadoUsuarios', JSON.stringify(model))
              } else {
                localStorage.removeItem('usuarioGuardadoUsuarios')
              }
              this.usuarioService.getMenuTree(res.rut).subscribe(e => {
                sessionStorage.setItem('arbol', JSON.stringify(e));
                if (e.empresasDto.length > 1) {
                  this.router.navigate(['dashboard/selectBusiness']);
                } else if (e.empresasDto.length == 1) {
                  this.router.navigate(['dashboard/selectPlant/' + e.empresasDto[0].emp_id]);
                } else {
                  this.router.navigate(['dashboard/selectBusiness']);
                }

                //this.router.navigateByUrl('/dashboard/selectForm');
                // if (d.username == "demo") {
                //   sessionStorage.setItem('currentTree', JSON.stringify(d.empresasDto));
                // } else {
                //   sessionStorage.removeItem('currentTree');
                // }
                // //this.router.navigateByUrl('/dashboard');
                // this.router.navigateByUrl('/dashboard/selectForm');
              },
                err => {
                  this.openSnackBar(err, "Cerrar", "error-snackbar")
              })
            }
          } else {
            this.openSnackBar("Este usuario tiene perfil Administrador Optimal, no puede responder cuestionarios", "Cerrar", "error-snackbar");
          }
        } else {
          this.openSnackBar("El usuario no posee el rol adecuado", "Cerrar", "error-snackbar");
        }
      });
    },
      err => {
        this.downloadVariable(err);
        this.openSnackBar("No se pudo acceder al servidor", "Cerrar", "error-snackbar");
        this.loading = false;
      });
    // this.usuarioService.login(this.loginForm.value)
    //   .subscribe({
    //     next: (data) => {
    //       if (this.loginForm.get('remember')!.value) {
    //         localStorage.setItem('usuarioRecordar', JSON.stringify(this.loginForm.value));
    //       }
    //       this.router.navigateByUrl('/dashboard');
    //     },
    //     error: (err) => {
    //       // Si sucede un error
    //     }
    //   });

  }
      
  campoNoValido(campo : string){
    return this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched;
  }

  testAPI() {
    //this.router.navigateByUrl('/register');
    this.router.navigateByUrl('/cuestionarios');
  }

  forgotPassword() {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '85%',
      height: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result.status) {
          this.openSnackBar(result.data, "Cerrar", "success-snackbar");
        } else {
          this.openSnackBar(result.data, "Cerrar", "error-snackbar");
        };
        this.loginForm.get('password')?.reset();
      }
    });
  }

  nextInput() {
    let element = document.getElementById('password');
    element?.focus();
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

  downloadVariable(variable: any) {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(variable));
    let downloader = document.createElement('a');
    downloader.setAttribute('href', data);
    downloader.setAttribute('download', 'file.json');
    downloader.click();
  }

}
