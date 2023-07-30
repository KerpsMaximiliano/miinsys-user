import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UsuariosService } from "src/app/services/usuarios.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
      const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
  
      return invalidCtrl || invalidParent;
    }
}

@Component({
    selector: 'change-password-dialog',
    templateUrl: 'change-password-dialog.component.html',
    styleUrls: [ './change-password-dialog.component.scss' ]
})


export class ChangePasswordDialog implements OnInit{

    changePassword!: FormGroup;
    hiddenPassword: boolean = true;
    hiddenPassword2: boolean = true;

    matcher = new MyErrorStateMatcher();

    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private usuarioService: UsuariosService,
        private fb: FormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {
        this.changePassword = this.fb.group({
            username: [null],
            password: ['', Validators.required],
            confirmPassword: ['']
        }, { validators: this.checkPasswords });
    }

    ngOnInit(): void {
        this.changePassword.get('username')?.setValue(this.data.username)
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        if(this.changePassword.invalid || this.changePassword.get('password')!.value != this.changePassword.get('confirmPassword')!.value) {
            this.changePassword.markAllAsTouched();
            return;
        }
        this.usuarioService.changePassword({username: this.data.username.toString(), password: this.changePassword.get('password')!.value}).subscribe(d => {
            //this.dialogRef.close({status: true, data: d.message});
            if(d.status == "Error") {
                this.openSnackBar(d.message, "Cerrar", "error-snackbar");
                this.dialogRef.close();
            } else {
                this.openSnackBar("Contraseña cambiada correctamente", "Cerrar", "success-snackbar");
                this.usuarioService.logout();
                this.router.navigate(['/']);
                this.dialogRef.close();
            }
        },
        err => {
            //this.dialogRef.close({status: false, data: err.error.message});
            this.openSnackBar(err.error.message, "Cerrar", "error-snackbar");
            this.dialogRef.close();
        })
    }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password')?.value;
        let confirmPass = group.get('confirmPassword')?.value
        return pass === confirmPass ? null : { notSame: true }
    }

    openSnackBar(message: string, action: string, className: string) {
        this._snackBar.open(message, action, {
          duration: 5000,
          panelClass: className
        });
      }
}