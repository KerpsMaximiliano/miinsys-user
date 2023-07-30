import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';
import {MatPaginatorModule} from '@angular/material/paginator';

  
const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot( routes ),
    AuthRoutingModule,
    PagesRoutingModule,
    MatPaginatorModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }