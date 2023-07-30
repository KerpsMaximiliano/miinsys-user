export class CuestionarioModel{
     id:number = 0;
    name:string = '';
}

export interface CuestionarioSimpleRespuesta {
    file: File,
    answer: boolean,
    text: string
}

export interface CuestionarioCompuestoRespuesta {
    objective: string,
    machine: string,
    questions: Array<RadioCuestionario>,
    questionIndexToJustify?: number
}

export interface RadioCuestionario {
    position?: number,
    control: string,
    value: string
    file?: FileList
    justificacion?: string
}

export interface CuestionarioCompuestoBack {
    titulo: string;
    formGroup: any,
    respuestas: any,
    control: any,
    panelClases: any,
    index: any,
    seccion: any,
    idCuestionario?: number,
    idActividad?: number,
    planificado?: number
}