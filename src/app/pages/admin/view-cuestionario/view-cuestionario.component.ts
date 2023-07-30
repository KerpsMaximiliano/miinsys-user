import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

interface CuestionarioGuardado {
  id: number,
  cuestionario: {
    cuestionarioId: number,
    fechaCarga: string,
    latitud: number,
    longitud: number,
    userName: string,
    secciones: Array<{
      seccionId: number,
      preguntas: Array<{
        label?: string,
        preguntaId: number,
        preguntaOpcion: number,
        preguntaTipo: number,
        preguntaValor: string
      }>
    }>
  }
};

@Pipe({name: 'tipoPregunta'})
export class TipoPreguntaPipe implements PipeTransform {
  private tpr_id = ["", "", "", "", 
  "Texto Fijo",
  "Texto",
  "Combo selección",
  "Numérico",
  "Nombre de Usuario",
  "Fecha",
  "Selección Radio",
  "RUT Usuario",
  "Calendario",
  "Autocompletado",
  "Subir foto",
  "Selección Radio SI/NO"];
  transform(value: number): string {
    return this.tpr_id[value];
  }
};

@Pipe({name: 'valorPregunta'})
export class ValorPreguntaPipe implements PipeTransform {
  transform(valor: any, element: any): string {
    let transformed: string = "";
    switch (element.preguntaTipo) {
      case 10:
        transformed = (element.preguntaValor == 0) ? 'Malo' : (element.preguntaValor == 1) ? 'Bueno' : 'N/A';
        break;

      case 15:
        transformed = (element.preguntaValor == 0) ? 'No' : 'Si';
        break;

      default:
        transformed = element.preguntaValor;
        break;
    }
    return transformed;
  }
};
/*
  TPR_ID
  4 - Texto fijo +
  5 - Texto +
  6 - Combo +
  7 - Numérico +
  8 - NOMBRE_USUARIO +
  9 - DATE +
  10 - Selección (Radio) +
  11 - RUT_USUARIO +
  12 - Calendario +
  13 - Completar ???
  14 - Subir foto + 
  15 - Radio SI/NO +
  */

@Component({
  selector: 'app-view-cuestionario',
  templateUrl: './view-cuestionario.component.html',
  styleUrls: ['./view-cuestionario.component.scss'],
})

export class ViewCuestionarioComponent implements OnInit {

  title: string = "Cuestionario"

  cuestionarios = [] as Array<CuestionarioGuardado>;
  cuestionarioId: number = 0;
  currentCuestionario = {} as CuestionarioGuardado;
  errorFind: boolean = false;
  showData: boolean = false;
  cuestionarioModel: any = [];
  tituloCuestionario = "";
  displayedColumns: string[] = ['preguntaId', 'pregunta', 'preguntaTipo','preguntaValor'];
  dataSource = [{}];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cuestionarios = JSON.parse(localStorage.getItem('cuestionarios')!);
    this.cuestionarioId = this.activatedRoute.snapshot.params['id'];
    this.currentCuestionario = this.cuestionarios.find(c => c.id == this.cuestionarioId)!;
    console.log(this.currentCuestionario);
    if(this.currentCuestionario == undefined) {
      this.errorFind = true;
    } else {
      this.usuarioService.getCuestionario(this.currentCuestionario.cuestionario.cuestionarioId).subscribe(d => {
        this.tituloCuestionario = d.cue_descripcion;
        d.secciones.$values.forEach((seccion: { sec_id: any; sec_descripcion: any; orden: any; preguntas: { $values: any[]; }; }, index: number) => {
          let seccionesForm = {
            nombre: seccion.sec_descripcion,
            orden: seccion.orden,
            seccionId: seccion.sec_id,
            preguntas: [] as Array<{}>
          };
          seccion.preguntas.$values.forEach(pregunta => {
            let preguntaForm = {
              preguntaId: pregunta.pre_id,
              label: pregunta.pre_descripcion,
              tipo: pregunta.tpr_id,
              justificado: false,
              opciones: [] as Array<{
                descripcion: string,
                valor: string,
                id: number
              }>
            };
            this.currentCuestionario.cuestionario.secciones.find(sec => sec.seccionId == seccionesForm.seccionId)!.preguntas.find(pre => pre.preguntaId == preguntaForm.preguntaId)!.label = preguntaForm.label;
            
            pregunta.opciones.$values.forEach((opcion: { opc_id: any; opc_descripcion: any; opc_valor: any; }) => {
              let opcionesForm = {
                descripcion: opcion.opc_descripcion,
                valor: opcion.opc_valor,
                id: opcion.opc_id
              };
              preguntaForm.opciones.push(opcionesForm);
            });
            if(preguntaForm.tipo === 10) {
              preguntaForm.opciones.sort((a, b) => {
                let textA = a.descripcion.toUpperCase();
                let textB = b.descripcion.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
            }
            if(pregunta.tipo === 15) {
              preguntaForm.opciones.sort((a, b) => {
                let textA = a.descripcion.toUpperCase();
                let textB = b.descripcion.toUpperCase();
                return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
              });
            }
            seccionesForm.preguntas.push(preguntaForm)
          });
          this.cuestionarioModel.push(seccionesForm);
        })
        this.cuestionarioModel = this.cuestionarioModel.sort((seccion1: { orden: number; }, seccion2: { orden: number; }) => (seccion1.orden < seccion2.orden) ? -1 : (seccion1.orden > seccion2.orden) ? 1 : 0);
        console.log(this.cuestionarioModel);
        this.dataSource = this.currentCuestionario.cuestionario.secciones[0].preguntas;
        this.showData = true;
      });
    }
  }

  selectSeccion(seccionId: number, event: any) {
    if(event.isUserInput) {
      this.dataSource = this.currentCuestionario.cuestionario.secciones[this.currentCuestionario.cuestionario.secciones.findIndex(seccion => seccion.seccionId == seccionId)].preguntas;
    }
  }

  


}