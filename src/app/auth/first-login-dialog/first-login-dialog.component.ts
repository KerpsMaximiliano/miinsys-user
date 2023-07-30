import { Component, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UsuariosService } from "src/app/services/usuarios.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
      const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
  
      return invalidCtrl || invalidParent;
    }
}

@Component({
    selector: 'first-login-dialog',
    templateUrl: 'first-login-dialog.component.html',
    styleUrls: [ './first-login-dialog.component.scss' ]
})


export class FirstLoginDialog {

    changePassword!: FormGroup;
    hiddenPassword: boolean = true;
    hiddenPassword2: boolean = true;

    matcher = new MyErrorStateMatcher();

    constructor(
        public dialogRef: MatDialogRef<FirstLoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private usuarioService: UsuariosService,
        private fb: FormBuilder,
    ) {
        this.changePassword = this.fb.group({
            password: ['', Validators.required],
            confirmPassword: ['']
        }, { validators: this.checkPasswords });
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
            if(d.status == "Error") {
                this.dialogRef.close({status: false, data: d.message});
            } else {
                this.dialogRef.close({status: true, data: d.message});
            }
        },
        err => {
            this.dialogRef.close({status: false, data: err.error.message});
        })
    }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password')?.value;
        let confirmPass = group.get('confirmPassword')?.value
        return pass === confirmPass ? null : { notSame: true }
    }
}