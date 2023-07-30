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
    selector: 'leave-confirmation-dialog',
    templateUrl: 'leave-confirmation-dialog.component.html',
    styleUrls: [ './leave-confirmation-dialog.component.scss' ]
})


export class LeaveConfirmationDialog {


    constructor(
        public dialogRef: MatDialogRef<LeaveConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private usuarioService: UsuariosService,
    ) {}

    onNoClick(): void {
        this.dialogRef.close({status: false});
    }

    leave() {
        this.dialogRef.close({status: true});
    }
}