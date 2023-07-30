import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioCompuestoBack } from 'src/app/interfaces/cuestionario';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { FilesService } from 'src/app/services/file.service';

@Component({
  selector: 'app-pregunta-firma',
  templateUrl: './pregunta-firma.component.html',
  styleUrls: ['./pregunta-firma.component.css']
})
export class PreguntaFirmaComponent implements OnInit {

  //FIRMA
  @ViewChild('signPad', {static: false}) signPad!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter();
  private signatureImg?: string;
  private sigPadElement: any;
  private context: any;
  public isDrawing!: boolean;

  onMouseDown(e: any): void {
    // The mouse button is clicked, which means the start of drawing the signature
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e: any): void {
    // The mouse button is released, so this means the end of drawing the signature
    this.isDrawing = false;
  }

  onMouseMove(e: any): void {
    this.canvasTouched = true;
    if (this.isDrawing) { // if we're not drawing we need to ignore the events
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  borrarFirma(): void {
    this.canvasTouched = false;
    this.signatureImg = undefined;
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  relativeCoords(event: any): { x: number, y: number } {
    const bounds = event.target.getBoundingClientRect();
    const cords = {
      clientX: event.clientX || event.changedTouches[0].clientX,
      clientY: event.clientY || event.changedTouches[0].clientY
    };
    const x = cords.clientX - bounds.left;
    const y = cords.clientY - bounds.top;
    return {x, y};
  }

  component: string = "PreguntaFirma"
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

  showCanvas: boolean = false;
  canvasWidth!: number;

  canvasTouched: boolean = false;

  datosAdicionales = [] as Array<any>;
  datosAdicionalesForm: FormGroup = new FormGroup({});
  showForm: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private cuestionarioService: CuestionarioService,
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
    this.showCanvas = true;
    this.canvasWidth = window.innerWidth - 70;
    setTimeout(() => {
      this.sigPadElement = this.signPad.nativeElement;
      this.context = this.sigPadElement.getContext('2d');
      this.context.strokeStyle = '#000';
    }, 100);
    this.cuestionarioService.getFirmaDatoAdicional(this.idPregunta).subscribe(d => {
      this.datosAdicionales = d.firmaDatoAdicional;
      if(this.datosAdicionales.length > 0) {
        this.datosAdicionales.forEach(dato => {
          if(dato.orden == 3) {
            this.datosAdicionalesForm.addControl(dato.id.toString(), new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.email]));
          } else {
            this.datosAdicionalesForm.addControl(dato.id.toString(), new FormControl(null, Validators.required));
          }
        });
        this.showForm = true;
      }
    })
  }

  submit() {
    if(!this.canvasTouched) {
      this.openSnackBar("El campo de firma está vacío", "X", "warn-snackbar");
      return;
    };
    if(this.datosAdicionalesForm.invalid) {
      this.datosAdicionalesForm.markAllAsTouched();
      return;
    };
    if(this.datosAdicionales.length > 0) {
      let finalArray = [] as Array<any>;
      this.datosAdicionales.forEach(dato => {
        finalArray.push({
          id_pregunta: this.idPregunta,
          valor: this.datosAdicionalesForm.get(dato.id.toString())?.value,
          orden: dato.orden
        })
      });
      this.cuestionarioService.setFirmaDatosAdicionales(finalArray);
    }
    this.signatureImg = this.sigPadElement.toDataURL('image/png');
    this.signatureSaved.emit(this.signatureImg);
    let firmaName = 'Firma.png';
    let firmaBlob = this.fileService.b64toBlob(this.signatureImg?.split(',')[1], 'image/png');
    let firmaFile = new File([firmaBlob], firmaName, { type: 'image/png' });
    this.fileToUpload = firmaFile;
    let pregunta = this.savedAnswer.respuestas.filter((seccion: { preguntas: any[]; }) => (seccion.preguntas.find(p => p.control == this.savedAnswer.control)))[0].preguntas.find((p: { control: string; }) => p.control == this.savedAnswer.control);
    let find = this.savedFiles.find(file => file.control == pregunta.control);
    if (find == undefined) {
      this.fileService.subirArchivo(this.fileToUpload, 1).subscribe(d => {
        this.cuestionarioService.setFile({control: pregunta.control, fileId: d.id, justificacion: this.respuesta});
        this.savedAnswer.formGroup.get(this.savedAnswer.control).setValue("Firma.jpg");
        this.cuestionarioService.setAnswerBack(this.savedAnswer);
        this.openSnackBar(d.message, "X", "success-snackbar");
        this.router.navigate([this.returnRoute]);
        setTimeout(() => {
          this.openSnackBar(d.message, "X", "success-snackbar");
          this.router.navigate([this.returnRoute]);
        }, 50);
      })
    } else {
      this.fileService.actualizarArchivo(this.fileToUpload, find!.fileId, 1).subscribe(d => {
        this.cuestionarioService.setFile({control: pregunta.control, fileId: d.id, justificacion: this.respuesta});
        this.savedAnswer.formGroup.get(this.savedAnswer.control).setValue('C:\fakepath\Firma.png');
        setTimeout(() => {
          this.cuestionarioService.setAnswerBack(this.savedAnswer);
          this.openSnackBar(d.message, "X", "success-snackbar");
          this.router.navigate([this.returnRoute]);
        }, 50);
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
