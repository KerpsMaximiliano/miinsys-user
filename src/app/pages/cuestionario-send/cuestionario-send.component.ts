import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

// * Services.
import { GeolocationService } from 'src/app/core/services/geolocation.service';

@Component({
  selector: 'app-cuestionario-send',
  templateUrl: './cuestionario-send.component.html',
  styleUrls: ['./cuestionario-send.component.scss'],
})
export class CuestionarioSendComponent implements OnInit {
  component: string = 'CuestionarioSend';
  formularioSendForm: FormGroup;
  answer = {};

  private date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuariosService,
    private cuestionarioService: CuestionarioService,
    private geolocationService: GeolocationService
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
      fecha: this.getDate(),
      hora: this.getTime(),
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

  /**
   * Retorna la hora del usuario local en formato: HH:MM.
   * Añade un 0 si son menos de 10 horas para dar el formato 0H.
   * Añade un 0 si son menos de 10 minutos para dar el formato 0M.
   * @returns string: representa la hora del dispositivo del usuario.
   */
  private getTime(): string {
    let date = new Date();

    let hours: string | number = date.getHours();
    if (date.getHours() < 10) hours = `0${date.getHours()}`;

    let minutes: string | number = date.getMinutes();
    if (date.getMinutes() < 10) minutes = `0${date.getMinutes()}`;

    return `${hours}:${minutes}`;
  }

  /**
   * Retorna la fecha del usuario local en formato: DD-MM-YYYY
   * Añade un 0 si son menos de 10 dias para dar el formato 0D.
   * Añade un 0 si son menos de 10 meses para dar el formato 0M.
   * @returns string: representa la fecha del dispositivo del usuario.
   */
  private getDate(): string {
    let date = new Date();
    let year: number = date.getFullYear();

    let day: string | number = date.getDate();
    if (date.getDay() < 10) day = `0${date.getDay()}`;

    let month: string | number = date.getMonth() + 1;
    if (date.getMonth() < 10) day = `0${date.getMonth()}`;

    return `${day} - ${month} - ${year}`;
  }
}
