import { CuestionarioModel } from './cuestionario';
export class CriticTaskModel{
    id:number = 0;
    name:string = '';
    cuestionarios : CuestionarioModel [] =[];
    descripcion?: string;
    nivel?: string;
    orden?: string;
    cuestionario_id?: string
}