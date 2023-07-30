export interface Pregunta {
    id:number;
    enunciado : string;
    tipo: number;
    requiereJustificacion:boolean;
    opciones: string[];
    respuesta?: number;
}

export interface Preguntas extends Array<Pregunta>{}
