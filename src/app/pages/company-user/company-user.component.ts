import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/interfaces/user';
import { CompanyUserModel } from '../../interfaces/company-user';

@Component({
  selector: 'app-company-user',
  templateUrl: './company-user.component.html'
})
export class CompanyUserComponent implements OnInit {

  component: string = "CompanyUser"

  constructor() { }

  ngOnInit(): void {
  }

  getCompanies() : CompanyUserModel[]
  {
    const estructuraCuestionarios : UserModel = JSON.parse(sessionStorage.getItem('estructuraCuestionarios')!);
    return estructuraCuestionarios.companyUser;    
  }
}
