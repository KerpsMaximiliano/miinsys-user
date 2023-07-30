import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FilesService } from 'src/app/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-planificado-signature',
  templateUrl: './planificado-signature.component.html',
  styleUrls: ['./planificado-signature.component.scss']
})
export class PlanificadoSignatureComponent implements OnInit {

  component: string = "PlanificadoSignature";

  cuestionarioBack: any;
  firmas = [] as Array<{
    firma: any,
    usuario: number
  }>;
  usuariosFirmar: Array<{rut: number, nombre?: string, cargo?: string, id_archivo: number, tipo: number}> = [];
  usuarioActual!: {rut: number, nombre?: string, cargo?: string, id_archivo: number, tipo: number};
  showCanvas: boolean = false;
  canvasWidth!: number;
  idActividad: number = 0;

  //FIRMAS

  @ViewChild('signPad', {static: false}) signPad!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter();
  private signatureImg?: string;
  private sigPadElement: any;
  private context: any;
  private isDrawing!: boolean;

  // public ngAfterViewInit(): void {
  //   setTimeout(() => {
      
  //   }, 400);
    
  // }

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
    if (this.isDrawing) { // if we're not drawing we need to ignore the events
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  borrarFirma(): void {
    this.signatureImg = undefined;
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  guardarFirma(): void {
    this.signatureImg = this.sigPadElement.toDataURL('image/png');
    this.signatureSaved.emit(this.signatureImg);
    // fetch(this.signatureImg!).then(res => res.blob()).then(console.log);
    // let a = document.createElement('a');
    // document.body.appendChild(a);
    // a.setAttribute('style', 'display: none');
    // a.href = this.signatureImg!;
    // a.download = "firma";
    // a.click();
    // window.URL.revokeObjectURL(this.signatureImg!);
    // a.remove();
    let i = this.usuariosFirmar.indexOf(this.usuarioActual);
    let firmaName = 'Firma ' + this.usuarioActual.nombre + ' ' + this.usuarioActual.rut + '.png';
    let firmaBlob = this.fileService.b64toBlob(this.signatureImg?.split(',')[1], 'image/png');
    let firmaFile = new File([firmaBlob], firmaName, { type: 'image/png' });
    this.firmas.push({
      firma: firmaFile,
      usuario: this.usuarioActual.rut
    });
    if(i == this.usuariosFirmar.length - 1) {
      this.showCanvas = false;
    } else {
      this.usuarioActual = this.usuariosFirmar[i + 1]
    };
    this.borrarFirma();
  }

  private relativeCoords(event: any): { x: number, y: number } {
    const bounds = event.target.getBoundingClientRect();
    const cords = {
      clientX: event.clientX || event.changedTouches[0].clientX,
      clientY: event.clientY || event.changedTouches[0].clientY
    };
    const x = cords.clientX - bounds.left;
    const y = cords.clientY - bounds.top;
    return {x, y};
  }

  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuariosService,
    private cuestionarioService: CuestionarioService,
    private fileService: FilesService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idActividad = this.cuestionarioService.getAnswerBack().idActividad!;
    this.usuarioService.getActividadById(this.idActividad).subscribe(d => {
      console.log(d);
      if(d.participantes.length > 0) {
        d.participantes.forEach((part: { rut_participante: number; }) => {
          this.usuarioService.getUserData(part.rut_participante).subscribe(res => {
            this.usuariosFirmar.push({
              rut: part.rut_participante,
              nombre: res.firstName + ', ' + res.lastName,
              id_archivo: 0,
              tipo: 2
            });
            if (d.participantes[d.participantes.length - 1].rut_participante == part.rut_participante) {
              setTimeout(() => {
                this.usuariosFirmar.push({
                  rut: d.rut_lider,
                  nombre: d.nombre_lider + ', ' + d.apellido_lider,
                  id_archivo: 0,
                  tipo: 1
                });
                if(d.adicionales.length > 0) {
                  d.adicionales.forEach((ad: { rut: any; nombre: any; cargo: any; }) => {
                    this.usuariosFirmar.push({
                      rut: ad.rut,
                      nombre: ad.nombre,
                      cargo: ad.cargo,
                      id_archivo: 0,
                      tipo: 3
                    })
                  });
                };
                this.usuariosFirmar.sort((a, b) => {
                  return (a.tipo < b.tipo) ? -1 : (a.tipo > b.tipo) ? 1 : 0;
                });
                this.usuarioActual = this.usuariosFirmar[0];
                this.showCanvas = true;
                setTimeout(() => {
                  this.sigPadElement = this.signPad.nativeElement;
                  this.context = this.sigPadElement.getContext('2d');
                  this.context.strokeStyle = '#000';
                }, 100);
              }, 10);
            }
          })
        });
      } else {
        this.usuariosFirmar.push({
          rut: d.rut_lider,
          nombre: d.nombre_lider + ', ' + d.apellido_lider,
          id_archivo: 0,
          tipo: 1
        });
        if(d.adicionales.length > 0) {
          d.adicionales.forEach((ad: { rut: any; nombre: any; cargo: any; }) => {
            this.usuariosFirmar.push({
              rut: ad.rut,
              nombre: ad.nombre,
              cargo: ad.cargo,
              id_archivo: 0,
              tipo: 3
            })
          });
        };
        this.usuariosFirmar.sort((a, b) => {
          return (a.tipo < b.tipo) ? -1 : (a.tipo > b.tipo) ? 1 : 0;
        });
        this.usuarioActual = this.usuariosFirmar[0];
        this.showCanvas = true;
        setTimeout(() => {
          this.sigPadElement = this.signPad.nativeElement;
          this.context = this.sigPadElement.getContext('2d');
          this.context.strokeStyle = '#000';
        }, 100);
      }
    })
    this.canvasWidth = window.innerWidth - 60;
  }

  finalizarFormulario() {
    this.cuestionarioBack = this.cuestionarioService.getPlanificadoFinalAnswer();
    this.firmas.forEach((fir, index) => {
      this.fileService.subirArchivo(fir.firma, 5).subscribe(fileRes => {
        let find = this.usuariosFirmar.find(u => u.rut == fir.usuario);
        this.usuariosFirmar[this.usuariosFirmar.indexOf(find!)].id_archivo = fileRes.id;
        if((this.firmas.length - 1) == index) {
          setTimeout(() => {
            this.cuestionarioBack.firmantes = [];
            this.usuariosFirmar.forEach(uf => {
              if (uf.cargo) {
                this.cuestionarioBack.firmantes.push({
                  id_archivo: uf.id_archivo,
                  rut: uf.rut,
                  nombre: uf.nombre,
                  cargo: uf.cargo
                })
              } else {
                this.cuestionarioBack.firmantes.push({
                  id_archivo: uf.id_archivo,
                  rut: uf.rut,
                  nombre: uf.nombre
                })
              }
            });
            Object.assign(this.cuestionarioBack, {id_actividad: this.idActividad});
            this.cuestionarioService.setPlanificadoFinalAnswer(this.cuestionarioBack);
            this.router.navigate(['/dashboard/previewCuestionario']);
            // this.usuarioService.postCuestionario(this.cuestionarioBack).subscribe(d => {
            //   this.fileService.traerArchivo(d.id_imagen, 4).subscribe(res => {
            //     FileSaver.saveAs(this.fileService.b64toBlob(res.file, 'application/pdf'), res.fileName);
            //     this.saveToCookies(this.cuestionarioBack, d.id);
            //     this.openSnackBar(d.message + " - id: " + d.id, "Cerrar", "big-success-snackbar");
            //     this.router.navigate(['/dashboard/cuestionarioSend']);
            //   })
            // })
          }, 10);
        }
      })
    })
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

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

}
