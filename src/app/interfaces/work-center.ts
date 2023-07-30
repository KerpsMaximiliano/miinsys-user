import { ServiceTypeModel } from "./service-type";

export class WorkCenterModel{
     id:number = 0;
     name:string = '';
     servicesTypes : ServiceTypeModel [] = [];
     descripcion?: string;
     nivel?: string;
     orden?: string;
     cuestionario_id?: string;

}