import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { CuestionarioSimpleRespuesta } from 'src/app/interfaces/cuestionario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cuestionario-simple-template',
  templateUrl: './cuestionario-simple-template.component.html',
  styleUrls: ['./cuestionario-simple-template.component.scss']
})
export class CuestionarioSimpleTemplateComponent implements OnInit {
  component: string = "CuestionarioSimpleTemplate";
  returnUrl: string = '';
  servicesTypeID: number = 0;
  workCenterID: number = 0;
  companyID: number = 0;

  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  finalAnswer = {} as CuestionarioSimpleRespuesta;
  uploadedFile = null;
  imgSrc: any;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private cuestionarioService: CuestionarioService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe(
      (params: ParamMap) => {
        this.servicesTypeID = Number(params.get('servicesTypeID')!);
        this.workCenterID = Number(params.get('workCenterID')!);
        this.companyID = Number(params.get('companyID')!);
      }
    );
  }

  returnBack() {
    this.router.navigate([this.returnUrl]);
  }

  returnToHome() {
    this.router.navigate(['dashboard/companies']);
  }

  answer(respuesta: number) {
    //console.log(respuesta)
    if(respuesta == 1) {
      this.showFirst = false;
      this.showSecond = false;
      this.showThird = true;
      this.finalAnswer.answer = true;
    } else if (respuesta == 2){
      this.showFirst = false;
      this.showSecond = true;
      this.showThird = false;
      this.finalAnswer.answer = false;
    } else if (respuesta == 3){
      window.document.getElementById('camera_button')?.click();
    } else if (respuesta == 4) {
      if(this.uploadedFile != null) {
        this.finalAnswer.file = this.uploadedFile[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.finalAnswer.file);
        reader.onload = _event => {
          let url = reader.result;
          this.imgSrc = url;
        }
        //console.log(this.finalAnswer);
        this.showFirst = false;
        this.showSecond = false;
        this.showThird = true;
      } else {
        this.openSnackBar("Debe seleccionar una foto", "Cerrar", "warn-snackbar");
      }
    }
  }

  file(event: any) {
    //console.log(event.srcElement.files);
    if(event.srcElement.files.length == 0) {
      this.uploadedFile = null;
    } else {
      this.uploadedFile = event.srcElement.files;
    }
  }

  send() {
    localStorage.setItem('formularioSimple', JSON.stringify(this.finalAnswer));
    this.cuestionarioService.setSimpleAnswer(this.finalAnswer);
    this.router.navigate(['/dashboard/cuestionarioSend']); 
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }
}

