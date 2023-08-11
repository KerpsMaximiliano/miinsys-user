import { Injectable } from '@angular/core';
import {
  CuestionarioCompuestoBack,
  CuestionarioCompuestoRespuesta,
  CuestionarioSimpleRespuesta,
} from '../interfaces/cuestionario';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuestionarioService {
  private simpleAnswer = {} as CuestionarioSimpleRespuesta;
  private answer = {} as CuestionarioCompuestoRespuesta;
  private answerBack = {} as CuestionarioCompuestoBack;
  private scores = {
    positive: 0,
    negative: 0,
  };
  private files = [] as Array<{
    control: string;
    fileId: number;
    justificacion: string | null;
  }>;
  private planificadoFinalAnswer: any;
  private questionTitle: string = '';
  private url: string = '';
  private firmaDatosAdicionales = [] as Array<any>;

  private location = {
    latitude: 0,
    longitude: 0,
  };

  constructor(private http: HttpClient) {}

  setFile(file: any | null) {
    if (file == null) {
      this.files = [];
    } else {
      let find = this.files.find((f) => f.control == file.control);
      if (find != undefined) {
        this.files = this.files.filter((item) => item !== find);
        this.files.push(file);
      } else {
        this.files.push(file);
      }
    }
  }

  getFiles() {
    return this.files;
  }

  getScores() {
    return this.scores;
  }

  setScores(scores: { positive: number; negative: number }) {
    this.scores = scores;
  }

  getSimpleAnswer() {
    return this.simpleAnswer;
  }

  setSimpleAnswer(answer: CuestionarioSimpleRespuesta | null) {
    if (answer == null) {
      this.simpleAnswer = {} as CuestionarioSimpleRespuesta;
    } else {
      this.simpleAnswer = answer;
    }
  }

  getAnswer() {
    return this.answer;
  }

  setAnswer(answer: CuestionarioCompuestoRespuesta | null) {
    if (answer == null) {
      this.answer = {} as CuestionarioCompuestoRespuesta;
    } else {
      this.answer = answer;
    }
  }

  getAnswerBack() {
    return this.answerBack;
  }

  setAnswerBack(answer: any | null) {
    if (answer == null) {
      this.answerBack = {} as CuestionarioCompuestoBack;
    } else {
      this.answerBack = answer;
    }
  }

  setPlanificadoFinalAnswer(answer: any | null) {
    if (answer == null) {
      this.planificadoFinalAnswer = null;
    } else {
      this.planificadoFinalAnswer = answer;
    }
  }

  getPlanificadoFinalAnswer() {
    return this.planificadoFinalAnswer;
  }

  public getLocation() {
    return this.location;
  }

  public setLocation(lat: number, lon: number): void {
    this.location.latitude = lat;
    this.location.longitude = lon;
  }

  getQuestionTitle() {
    return this.questionTitle;
  }

  setQuestionTitle(title: string) {
    this.questionTitle = title;
  }

  setUrl(url: string | null) {
    if (url == null) {
      this.url = '';
    } else {
      this.url = url;
    }
  }

  getUrl() {
    return this.url;
  }

  cleanAll() {
    this.setLocation(0, 0);
    this.setAnswer(null);
    this.setSimpleAnswer(null);
    this.setScores({ positive: 0, negative: 0 });
    this.setFile(null);
    this.setPlanificadoFinalAnswer(null);
    this.setUrl(null);
    this.setFirmaDatosAdicionales(null);
  }

  getFirmaDatoAdicional(idPregunta: number): Observable<any> {
    return this.http.get<any>(
      `${environment.base_url}FirmaDatosAdicionales/GetByID?id_pregunta=` +
        idPregunta
    );
  }

  getFirmaDatosAdicionales() {
    return this.firmaDatosAdicionales;
  }

  setFirmaDatosAdicionales(array: Array<any> | null) {
    if (array == null) {
      this.firmaDatosAdicionales = [];
    } else {
      if (this.firmaDatosAdicionales.length == 0) {
        array.forEach((dato) => {
          this.firmaDatosAdicionales.push(dato);
        });
      } else {
        this.firmaDatosAdicionales = this.firmaDatosAdicionales.filter(
          (x) => x.id_pregunta != array[0].id_pregunta
        );
        array.forEach((dato) => {
          this.firmaDatosAdicionales.push(dato);
        });
      }
    }
  }

  getListaById(idLista: number): Observable<any> {
    return this.http.get<any>(
      `${environment.base_url}ListaDatos?id=` + idLista
    );
  }

  getListaByParams(params: { empresa: number }): Observable<any> {
    return this.http.post<any>(
      `${environment.base_url}ListaDatos/GetByParams`,
      params
    );
  }
}
