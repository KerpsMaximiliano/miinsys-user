import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { RegisterPasswordComponent } from './register-password/register-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'AccountRecovery', component: AccountRecoveryComponent },
    { path: 'RegisterPassword', component: RegisterPasswordComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
