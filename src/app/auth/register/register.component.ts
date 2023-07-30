import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginData, RegisterData } from 'src/app/interfaces/login.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {

   loginForm! : FormGroup;
   hiddenPassword: boolean = true;
   hiddenPassword2: boolean = true;

   matcher = new MyErrorStateMatcher();
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar) 
  { 
    let user= sessionStorage.getItem('usuarioLogueado');
    if (!user) 
        user = localStorage.getItem('usuarioRecordar');

    if(user) 
      this.router.navigate(['/dashboard']);  
  }
                 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      mail: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['']
    }, { validators: this.checkPasswords })
  }

  login() {
    if (this.loginForm.invalid)
    {
      this.loginForm.markAllAsTouched();
      return;
    }

    let model: RegisterData = {
      username: this.loginForm.get('usuario')!.value,
      email: this.loginForm.get('mail')!.value,
      password: this.loginForm.get('password')!.value,
    }

    this.usuarioService.registerBackend(model).subscribe(d => {
      this.openSnackBar("Usuario creado exitosamente", "Cerrar", "success-snackbar");
      this.router.navigateByUrl('/dashboard');
    },
    err => {
      this.openSnackBar(err.error.message, "Cerrar", "error-snackbar");
    });
  }
      
  campoNoValido(campo : string){
    return this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched;
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
}

}
