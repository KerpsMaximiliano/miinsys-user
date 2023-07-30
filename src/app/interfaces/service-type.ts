import { CriticTaskModel } from "./critc-task";

export class ServiceTypeModel{
    public id:number = 0;
    public name:string = '';
    criticTasks : CriticTaskModel [] = [];
    descripcion?: string;
    nivel?: string;
    orden?: string;
    cuestionario_id?: string;

}