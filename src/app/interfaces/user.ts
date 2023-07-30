import { CompanyUserModel } from './company-user';

 export class UserModel{
     id:number = 0;
     name:string = '';
     companyUser : CompanyUserModel [] = [];
}