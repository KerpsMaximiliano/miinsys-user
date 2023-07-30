import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ArchivoCuestionarioModalComponent } from '../cuestionario-template/cuestionario-template.component';
import { FilesService } from 'src/app/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-preview-cuestionario',
  templateUrl: './preview-cuestionario.component.html',
  styleUrls: ['./preview-cuestionario.component.scss']
})
export class PreviewCuestionarioComponent implements OnInit {

  component: string = "CuestionarioPreview";
  answers: any = [];
  answerBackup: any = {};
  modeloCuestionario: any = {};
  cuestionarioId: number = 0;

  preguntaIdsLista = [] as Array<any>;
  listaMostrar = [] as Array<any>;

  showPreview: boolean = false;
  awaitingResponse: boolean = false;

  firmasDatosAdicionales: Array<any> = [];

  constructor(
    private router: Router,
    private usuarioService: UsuariosService,
    private cuestionarioService: CuestionarioService,
    public dialog: MatDialog,
    private fileService: FilesService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.answerBackup = this.cuestionarioService.getPlanificadoFinalAnswer();
    console.log(this.answerBackup);
    this.cuestionarioId = this.answerBackup.cuestionarioId;
    this.answerBackup.secciones.forEach((sec: { preguntas: any[]; }) => {
      sec.preguntas.forEach(pre => {
        this.answers[pre.preguntaId] = pre;
        if(pre.preguntaTipo == 13 && pre.preguntaValor != '') {
          this.preguntaIdsLista[pre.preguntaId] = pre.preguntaValor;
        }
      });
    });
    this.usuarioService.getCuestionario(this.cuestionarioId).subscribe(d => {
      if(this.preguntaIdsLista.length == 0) {
        this.showPreview = true;
      };
      console.log(d);
      this.modeloCuestionario = d;
      this.modeloCuestionario.secciones.sort((a: { orden: number; },b: { orden: number; }) => a.orden - b.orden);
      this.modeloCuestionario.secciones.forEach((sec: { preguntas: any[]; }) => {
        sec.preguntas.forEach(pre => {
          if(pre.tpr_id == 16) {
            this.cuestionarioService.getFirmaDatoAdicional(pre.pre_id).subscribe(d => {
              console.log(d);
              this.answerBackup;
              this.firmasDatosAdicionales[pre.pre_id] = this.answerBackup.firmaDatosAdicionales.filter((x: { id_pregunta: any; }) => x.id_pregunta == pre.pre_id);
              console.log(this.firmasDatosAdicionales);
              this.firmasDatosAdicionales[pre.pre_id].forEach((x: {orden: number}) => {
                Object.assign(x, {title: d.firmaDatoAdicional.find((firma: {orden: number}) => firma.orden == x.orden).descripcion});
              });
            })
          };
          if(pre.tpr_id == 13 && this.preguntaIdsLista[pre.pre_id] != undefined) {
            this.cuestionarioService.getListaById(pre.lst_id).subscribe(resLista => {
              let model = {
                columnas: [] as Array<any>,
                datos: [] as Array<any>
              };
              resLista.listaDatosColumna.forEach((col: { name: any; }) => {
                model.columnas.push(col.name)
              });
              let find = resLista.lista.find((lst: { id_fila: any; }) => lst.id_fila == Number(this.preguntaIdsLista[pre.pre_id]));
              for (const [key, value] of Object.entries(find.descripciones)) {
                model.datos.push(value)
              };
              this.listaMostrar[pre.pre_id] = model;
              if(this.preguntaIdsLista.length == this.listaMostrar.length) {
                this.showPreview = true;
              }
            })
          }
        })
      });
    });
  }

  openFoto(id: number, idPregunta?: number) {
    let data = {};
    if(idPregunta) {
      let find = this.answerBackup.firmaDatosAdicionales.filter((x: { id_pregunta: number; }) => x.id_pregunta == idPregunta);
      if(find.length > 0) {
        data = {id: id, type: "", additionalData: find}
      } else {
        data = {id: id, type: ""}
      }
    } else {
      data = {id: id, type: ""}
    }
    const dialogRef = this.dialog.open(ArchivoCuestionarioModalComponent, {
      maxHeight: '85vh',
      height: 'auto',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  sendFormulario() {
    this.awaitingResponse = true;
    this.usuarioService.postCuestionario(this.answerBackup).subscribe(d => {
      this.fileService.traerArchivo(d.id_imagen, 4).subscribe(res => {
        FileSaver.saveAs(this.fileService.b64toBlob(res.file, 'application/pdf'), res.fileName);
        this.saveToCookies(this.answerBackup, d.id);
        this.openSnackBar(d.message + " - id: " + d.id, "Cerrar", "big-success-snackbar");
        this.awaitingResponse = false;
        this.router.navigate(['/dashboard/cuestionarioSend']);
      })
    })
  }

  return() {
    this.router.navigate([this.cuestionarioService.getUrl()])
  }

  saveToCookies(form: any, id: number) {
    if(localStorage.getItem('cuestionarios') != null) {
      let model = JSON.parse(localStorage.getItem('cuestionarios')!);
      model.push({
        id: id, cuestionario: form
      });
      localStorage.setItem('cuestionarios', JSON.stringify(model));
    } else {
      let model = [
        { id: id, cuestionario: form}
      ];
      localStorage.setItem('cuestionarios', JSON.stringify(model));
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

}
