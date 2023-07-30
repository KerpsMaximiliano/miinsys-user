import { WorkCenterModel } from "./work-center";

 export class CompanyUserModel{
     id:number = 0;
     name:string = '';
     workCenters : WorkCenterModel [] = [];
}