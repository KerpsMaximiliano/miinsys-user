import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

// * Services.
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { DateTimeService } from 'src/app/core/services/date-time.service';

@Component({
  selector: 'app-cuestionario-send',
  templateUrl: './cuestionario-send.component.html',
  styleUrls: ['./cuestionario-send.component.scss'],
})
export class CuestionarioSendComponent implements OnInit {
  component: string = 'CuestionarioSend';
  formularioSendForm: FormGroup;
  answer = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuariosService,
    private cuestionarioService: CuestionarioService,
    private geolocationService: GeolocationService,
    private dateTimeService: DateTimeService
  ) {
    this.formularioSendForm = this.fb.group({
      usuario: [''],
      fecha: [''],
      hora: [''],
      ubicacion: [''],
      respuestasPositivas: [''],
      respuestasNegativas: [''],
    });
  }

  ngOnInit(): void {
    let scores = this.cuestionarioService.getScores();

    setTimeout(() => {
      this.cuestionarioService.cleanAll();
      this.usuarioService.logout();
      this.router.navigate(['/']);
    }, 300000);

    this.answer = this.cuestionarioService.getSimpleAnswer();
    let position = this.cuestionarioService.getLocation();

    this.formularioSendForm.patchValue({
      usuario: `${
        JSON.parse(sessionStorage.getItem('usuarioLogueado')!).username
      }`,
      fecha: this.dateTimeService.getDate(),
      hora: this.dateTimeService.getTime(),
      ubicacion: this.geolocationService.get(),
      respuestasPositivas: `${scores.positive} Positiva${
        scores.positive != 1 ? 's' : ''
      }`,
      respuestasNegativas: `${scores.negative} Negativa${
        scores.negative != 1 ? 's' : ''
      }`,
    });

    this.cuestionarioService.setLocation(0, 0);
    this.cuestionarioService.setAnswer(null);
    this.cuestionarioService.setSimpleAnswer(null);
    this.cuestionarioService.setFile(null);
    this.cuestionarioService.setPlanificadoFinalAnswer(null);
    this.cuestionarioService.setFirmaDatosAdicionales(null);
    this.formularioSendForm.disable();
  }

  sendFormulario() {
    this.router.navigate(['/dashboard/selectBusiness']);
  }
}
