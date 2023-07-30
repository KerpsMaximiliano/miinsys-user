import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UsuariosService } from "src/app/services/usuarios.service";

@Component({
    selector: 'forgot-password-dialog',
    templateUrl: 'forgot-password-dialog.component.html',
    styleUrls: [ './forgot-password-dialog.component.scss' ]
})


export class ForgotPasswordDialog {

    userForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<ForgotPasswordDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private usuarioService: UsuariosService,
        private fb: FormBuilder,
    ) {
        this.userForm = this.fb.group({
            usuario: ['', Validators.required]
        })
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        this.usuarioService.recoverPassword({username: this.userForm.get('usuario')!.value.toString()}).subscribe(d => {
            this.dialogRef.close({status: true, data: d.message});
          },
          err => {
            this.dialogRef.close({status: false, data: err.error.message});
          })
    }
}