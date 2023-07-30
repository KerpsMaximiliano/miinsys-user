import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import heic2any from 'heic2any';
import { CuestionarioCompuestoBack } from 'src/app/interfaces/cuestionario';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { FilesService } from 'src/app/services/file.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-justificar-respuesta-foto',
  templateUrl: './justificar-respuesta-foto.component.html',
  styleUrls: ['./justificar-respuesta-foto.component.css']
})
export class JustificarRespuestaFotoComponent implements OnInit {
  component: string = "JustificarRespuestaFoto"
  returnRoute: string = "";
  respuesta: string = "";
  file!: FileList;
  fileToUpload!: File;
  savedAnswer = {} as CuestionarioCompuestoBack;
  rut!: number;
  idCuestionario!: number;
  idPregunta!: number;
  savedFiles = [] as Array<{control: string, fileId: number, justificacion: string | null}>;
  titulo: string = "";
  showSpinner: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private cuestionarioService: CuestionarioService,
    private usuariosService: UsuariosService,
    private fileService: FilesService
  ) { }

  ngOnInit(): void {
    this.returnRoute = this.activatedRoute.snapshot.queryParams['returnUrl'];
    this.savedFiles = this.cuestionarioService.getFiles();
    this.titulo = this.cuestionarioService.getQuestionTitle();
    this.savedAnswer = this.cuestionarioService.getAnswerBack();
    this.rut = Number(JSON.parse(sessionStorage.getItem('usuarioLogueado')!).username);
    this.idPregunta = this.savedAnswer.respuestas.filter((seccion: { preguntas: any[]; }) => (seccion.preguntas.find(p => p.control == this.savedAnswer.control)))[0].preguntas.find((p: { control: string; }) => p.control == this.savedAnswer.control).preguntaId;
    this.idCuestionario = Number(this.savedAnswer.idCuestionario);
  }

  uploadFoto() {  
    window.document.getElementById(`cameraInput`)?.click();
  }

  fileSelect(event: any) {
    let convProm:Promise<any>;
    let extension = event.srcElement.files![0].name.split('.')[event.srcElement.files![0].name.split('.').length - 1];
    if(extension != 'jpg' && extension != 'heic' && extension != 'heif' && extension != 'webp' && extension != 'jfif' && extension != 'jpeg' && extension  != 'jpeg2000' && extension  != 'png' && extension  != 'svg' && extension  != 'bmp' && extension  != 'wmf' && extension != 'mp4') {
      this.openSnackBar("Extensión no admitida", "X", "warn-snackbar");
    } else {
      if(extension == "heic" || extension == "heif") {
        this.showSpinner = true;
        let files = Array.from(event.srcElement.files!);
        let heifFile = files[0] as File;
        let blob: Blob = files[0] as File;
        convProm = heic2any({blob,toType:"image/jpeg",quality:0.2}).then((jpgBlob:Blob | any) => {
          let newName = heifFile.name.replace(/\.[^/.]+$/, ".jpg");
          let finalFile = new File([jpgBlob], newName);
          this.fileToUpload = finalFile;
          this.file = event.srcElement.files!;
          this.showSpinner = false;
        }).catch(err => {
          //Handle error
        });
      } else {
        let files = Array.from(event.srcElement.files!);
        this.fileToUpload = files[0] as File;
        this.file = event.srcElement.files!;
        this.showSpinner = false;
      }
    }
  }

  submit() {
    if(this.respuesta == "" || this.file == undefined || this.file.length == 0) {
      this.openSnackBar("Debe justificar y subir una foto", "Cerrar", "warn-snackbar");
      return;
    }
    this.savedAnswer.respuestas.filter((seccion: { preguntas: any[]; }) => (seccion.preguntas.find(p => p.control == this.savedAnswer.control)))[0].preguntas.find((p: { control: string; }) => p.control == this.savedAnswer.control).justificado = true;
    let pregunta = this.savedAnswer.respuestas.filter((seccion: { preguntas: any[]; }) => (seccion.preguntas.find(p => p.control == this.savedAnswer.control)))[0].preguntas.find((p: { control: string; }) => p.control == this.savedAnswer.control);
    let find = this.savedFiles.find(file => file.control == pregunta.control);
    this.showSpinner = true;
    if (find == undefined) {
      this.fileService.subirArchivo(this.fileToUpload, 1).subscribe(d => {
        this.cuestionarioService.setFile({control: pregunta.control, fileId: d.id, justificacion: this.respuesta});
        this.cuestionarioService.setAnswerBack(this.savedAnswer);
        this.showSpinner = false;
        this.openSnackBar(d.message, "X", "success-snackbar");
        this.router.navigate([this.returnRoute]);
      })
    } else {
      this.fileService.actualizarArchivo(this.fileToUpload, find!.fileId, 1).subscribe(d => {
        this.cuestionarioService.setFile({control: pregunta.control, fileId: d.id, justificacion: this.respuesta});
        this.cuestionarioService.setAnswerBack(this.savedAnswer);
        this.showSpinner = false;
        this.openSnackBar(d.message, "X", "success-snackbar");
        this.router.navigate([this.returnRoute]);
      })
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

}
