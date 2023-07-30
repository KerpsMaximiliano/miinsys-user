import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { RegisterPasswordComponent } from './register-password/register-password.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterComponent } from './register/register.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ForgotPasswordDialog } from './forgot-password-dialog/forgot-password-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FirstLoginDialog } from './first-login-dialog/first-login-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountRecoveryComponent,
    RegisterPasswordComponent,
    ForgotPasswordDialog,
    FirstLoginDialog,
    ChangePasswordDialog
  ], 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ComponentesModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    
  ],
})
export class AuthModule { }
