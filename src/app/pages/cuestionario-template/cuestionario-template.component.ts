import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { Preguntas } from 'src/app/interfaces/pregunta.interfaces';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FilesService } from 'src/app/services/file.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import heic2any from 'heic2any';

// * Services.
import { GeolocationService } from 'src/app/core/services/geolocation.service';

@Component({
  selector: 'app-cuestionario-template',
  templateUrl: './cuestionario-template.component.html',
  styleUrls: ['./cuestionario-template.component.scss'],
})
export class CuestionarioTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  loading: boolean = false;
  component: string = 'CuestionarioTemplate';
  numeroPregunta: number = 0;
  preguntas: Preguntas = [];
  status: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  returnUrl: string = 'dashboard/selectForm';
  servicesTypeID: number = 0;
  workCenterID: number = 0;
  companyID: number = 0;
  cuestionarioId: number = 0;
  currentUser: string = '';
  currentUsername: { nombre: string; apellido: string } = {
    nombre: '',
    apellido: '',
  };
  latitude: number = 0;
  longitude: number = 0;
  autos = [
    { marca: 'Mazda', modelo: 'RX-7', año: '1998' },
    { marca: 'Chevrolet', modelo: 'Corsa', año: '2004' },
    { marca: 'Volkswagen', modelo: 'Golf', año: '2018' },
  ];

  cuestionarioForm: FormGroup = this.fb.group({});
  showFormOne = false;
  showFormTwo = false;
  cuestionarioBack: any;
  cuestionarioBackTitle: string = '';
  panelOpenState = false;
  panelClasses = [
    { position: 1, class: 'panel-white' },
    { position: 2, class: 'panel-white' },
    { position: 3, class: 'panel-white' },
  ];
  panelClassesBack = [] as Array<{ position: number; class: string }>;
  answeredQuestions: number = 0;
  totalQuestions: number = 0;

  planificado: number = 0;
  actividad: number = 0;

  progressBarWidth: string = '';

  listas = [] as Array<any>;
  listaIds = [] as Array<number>;
  listaMostrar = [] as Array<any>;
  empresaId: number = 0;
  controlListaIds = [] as Array<any>;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cuestionarioService: CuestionarioService,
    private _snackBar: MatSnackBar,
    private usuarioService: UsuariosService,
    private fileService: FilesService,
    public dialog: MatDialog,
    private geolocationService: GeolocationService
  ) {}

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
  16 - Firma
  17 - Alfanumérica
  */

  blockInvalidChar(e: any) {
    var k;
    k = e.charCode;
    return k >= 48 && k <= 57;
  }

  ngOnInit(): void {
    this.loading = true;
    this.currentUser = JSON.parse(
      sessionStorage.getItem('usuarioLogueado')!
    ).username.toString();
    console.log(JSON.parse(sessionStorage.getItem('usuarioLogueado')!));
    this.currentUsername.nombre = JSON.parse(
      sessionStorage.getItem('usuarioDatos')!
    ).firstName;
    this.currentUsername.apellido = JSON.parse(
      sessionStorage.getItem('usuarioDatos')!
    ).lastName;
    this.cuestionarioId = this.rutaActiva.snapshot.params['cuestionarioID'];
    this.empresaId = this.rutaActiva.snapshot.params['companyID'];
    console.log(this.cuestionarioId);
    this.cuestionarioService.setPlanificadoFinalAnswer(null);
    if (Object.keys(this.cuestionarioService.getAnswerBack()).length !== 0) {
      let model = this.cuestionarioService.getAnswerBack();
      if (model.planificado) {
        this.planificado = model.planificado;
      }
      if (model.idActividad) {
        this.actividad = model.idActividad;
      }
      this.cuestionarioBackTitle = model.titulo;
      this.cuestionarioBack = model.respuestas;
      console.log(model);
      console.log(this.cuestionarioService.getFiles());
      this.cuestionarioForm = model.formGroup;
      this.panelClassesBack = model.panelClases;
      this.cuestionarioBack.forEach(
        (
          seccion: {
            preguntas: {
              tipo: number;
              control: any;
              justificado: any;
              opciones: any;
              lst_id: number;
            }[];
            nombre: string;
          },
          index: number
        ) => {
          let check = false;
          seccion.preguntas.forEach((p) => {
            if (p.tipo === 10 || p.tipo === 15) {
              console.log(seccion);
              let find = seccion.preguntas
                .find((pr) => pr.control == p.control)!
                .opciones.find(
                  (op: { id: any }) =>
                    op.id == this.cuestionarioForm.get(p.control)!.value
                );
              console.log(find);
              if (find != undefined) {
                if (find.valor) {
                  if (find.valor === 0) {
                    this.cuestionarioForm
                      .get(p.control)!
                      .setValue(p.justificado ? find.id : '');
                  }
                }
              }
            }
            if (p.tipo == 13) {
              this.listaIds.push(p.lst_id);
              this.controlListaIds.push({
                id: p.lst_id,
                control: p.control,
              });
            }
            // if(p.tipo === 15) {
            //   if(this.cuestionarioForm.get(p.control)!.value === 0) {
            //     this.cuestionarioForm.get(p.control)!.setValue((p.justificado ? 0 : ''));
            //   };
            // };
            if (seccion.nombre == model.seccion.nombre) {
              check = true;
            } else {
              check = false;
            }
          });
          if (check) {
            this.panelOpenBack(index);
          } else {
            this.panelCloseBack(seccion, index);
          }
        }
      );

      if (this.controlListaIds.length > 0) {
        this.controlListaIds.forEach((controlId) => {
          this.cuestionarioService
            .getListaById(controlId.id)
            .subscribe((resLista) => {
              this.listas[controlId.id] = resLista;
              let modelListaMostrar = [] as Array<any>;
              let find = this.listas[controlId.id].lista.find(
                (lst: { id_fila: any }) =>
                  lst.id_fila ==
                  Number(this.cuestionarioForm.get(controlId.control)?.value)
              );
              for (const [key, value] of Object.entries(find.descripciones)) {
                modelListaMostrar.push(value);
              }
              this.listaMostrar[controlId.id] = modelListaMostrar;
              if (
                this.controlListaIds.indexOf(controlId) ==
                this.controlListaIds.length - 1
              ) {
                this.showFormTwo = true;
                this.loading = false;
              }
            });
        });
      } else {
        this.showFormTwo = true;
        this.loading = false;
      }

      setTimeout(() => {
        if (
          Object.keys(this.cuestionarioService.getAnswerBack()).length !== 0
        ) {
          this.panelOpenBack(this.cuestionarioService.getAnswerBack().index);
          document
            .getElementById(
              this.cuestionarioService.getAnswerBack().seccion.nombre
            )
            ?.scrollIntoView();
        }
      }, 1);
    } else {
      this.usuarioService.getCuestionario(this.cuestionarioId).subscribe(
        (d) => {
          console.log(d);
          this.cuestionarioBackTitle = d.descripcion_cuestionario;
          this.cuestionarioBack = [];
          let preguntaCounter = 1;
          this.planificado = d.planificado;
          this.actividad = d.id_actividad;
          console.log(d);
          this.latitude = this.cuestionarioService.getLocation().latitude;
          this.longitude = this.cuestionarioService.getLocation().longitude;
          d.secciones.forEach(
            (
              seccion: {
                sec_id: any;
                sec_descripcion: any;
                orden: any;
                preguntas: any[];
              },
              index: number
            ) => {
              let seccionesForm = {
                nombre: seccion.sec_descripcion,
                orden: seccion.orden,
                seccionId: seccion.sec_id,
                preguntas: [] as Array<{}>,
              };
              seccion.preguntas.forEach((pregunta) => {
                console.log(pregunta);
                let preguntaForm = {
                  preguntaId: pregunta.pre_id,
                  label: pregunta.pre_descripcion,
                  tipo: pregunta.tpr_id,
                  control: `pregunta${preguntaCounter}`,
                  justificado: false,
                  validators: pregunta.validators,
                  opciones: [] as Array<{
                    descripcion: string;
                    valor: string;
                    id: number;
                    orden: number;
                  }>,
                  orden: pregunta.orden,
                };

                preguntaCounter++;
                if (preguntaForm.tipo === 4) {
                  this.cuestionarioForm.addControl(
                    preguntaForm.control,
                    new FormControl({
                      value: pregunta.opciones[0].opc_descripcion,
                      disabled: true,
                    })
                  );
                  this.answeredQuestions++;
                } else if (preguntaForm.tipo === 8) {
                  //Nombre de usuario
                  this.cuestionarioForm.addControl(
                    preguntaForm.control,
                    new FormControl({
                      value:
                        this.currentUsername.apellido +
                        ', ' +
                        this.currentUsername.nombre,
                      disabled: true,
                    })
                  );
                  this.answeredQuestions++;
                } else if (preguntaForm.tipo === 9) {
                  // ! Fecha y hora
                  this.cuestionarioForm.addControl(
                    preguntaForm.control,
                    new FormControl({
                      value: `${this.getDate()}, ${this.getTime()}`,
                      disabled: true,
                    })
                  );
                  this.answeredQuestions++;
                } else if (preguntaForm.tipo === 11) {
                  //RUT_USUARIO
                  this.cuestionarioForm.addControl(
                    preguntaForm.control,
                    new FormControl({ value: this.currentUser, disabled: true })
                  );
                  this.answeredQuestions++;
                } else {
                  if (preguntaForm.tipo === 5) {
                    //Texto
                    this.cuestionarioForm.addControl(
                      preguntaForm.control,
                      new FormControl('', [
                        Validators.required,
                        Validators.pattern('^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$'),
                      ])
                    );
                  } else if (preguntaForm.tipo === 7) {
                    //Numero
                    this.cuestionarioForm.addControl(
                      preguntaForm.control,
                      new FormControl('', [
                        Validators.required,
                        Validators.pattern('(0|[1-9][0-9]*)$'),
                      ])
                    );
                  } else if (preguntaForm.tipo === 17) {
                    //Alfanumérico
                    this.cuestionarioForm.addControl(
                      preguntaForm.control,
                      new FormControl('', [Validators.required])
                    );
                  } else if (preguntaForm.tipo === 13) {
                    //Lista de Datos
                    this.cuestionarioForm.addControl(
                      preguntaForm.control,
                      new FormControl('', Validators.required)
                    );
                    Object.assign(preguntaForm, { lst_id: pregunta.lst_id });
                    this.listaIds.push(pregunta.lst_id);
                  } else {
                    this.cuestionarioForm.addControl(
                      preguntaForm.control,
                      new FormControl('', Validators.required)
                    );
                  }
                  if (preguntaForm.validators.length > 0) {
                    preguntaForm.validators.forEach(
                      (val: { id_validacion: any; Value: string }) => {
                        switch (val.id_validacion) {
                          case 0:
                            this.cuestionarioForm
                              .get(preguntaForm.control)!
                              .addValidators(Validators.required);
                            break;
                          case 1:
                            this.cuestionarioForm
                              .get(preguntaForm.control)!
                              .addValidators(Validators.max(Number(val.Value)));
                            break;
                          case 2:
                            this.cuestionarioForm
                              .get(preguntaForm.control)!
                              .addValidators(Validators.min(Number(val.Value)));
                            break;
                          case 3:
                            this.cuestionarioForm
                              .get(preguntaForm.control)!
                              .addValidators(
                                Validators.minLength(Number(val.Value))
                              );
                            break;
                          case 4:
                            this.cuestionarioForm
                              .get(preguntaForm.control)!
                              .addValidators(
                                Validators.maxLength(Number(val.Value))
                              );
                            break;
                        }
                      }
                    );
                  } else {
                    this.cuestionarioForm
                      .get(preguntaForm.control)
                      ?.removeValidators(Validators.required);
                  }
                }
                if (this.cuestionarioId == 4) {
                  switch (true) {
                    case preguntaForm.preguntaId == 75:
                      this.cuestionarioForm.controls[
                        preguntaForm.control
                      ].addValidators([Validators.min(0), Validators.max(10)]);
                      break;
                    case preguntaForm.preguntaId == 76 ||
                      preguntaForm.preguntaId == 77:
                      this.cuestionarioForm.controls[
                        preguntaForm.control
                      ].addValidators([Validators.min(0), Validators.max(2)]);
                      break;
                    case (preguntaForm.preguntaId >= 78 &&
                      preguntaForm.preguntaId <= 87) ||
                      preguntaForm.preguntaId == 163:
                      this.cuestionarioForm.controls[
                        preguntaForm.control
                      ].addValidators([Validators.max(128)]);
                      break;
                    case preguntaForm.preguntaId == 88 ||
                      preguntaForm.preguntaId == 162 ||
                      preguntaForm.preguntaId == 164:
                      this.cuestionarioForm.controls[
                        preguntaForm.control
                      ].addValidators([Validators.maxLength(128)]);
                      break;
                  }
                }
                pregunta.opciones.forEach(
                  (opcion: {
                    opc_id: any;
                    opc_descripcion: any;
                    opc_valor: any;
                    opc_orden: number;
                  }) => {
                    let opcionesForm = {
                      descripcion: opcion.opc_descripcion,
                      valor: opcion.opc_valor,
                      id: opcion.opc_id,
                      orden: opcion.opc_orden,
                    };
                    preguntaForm.opciones.push(opcionesForm);
                  }
                );
                if (preguntaForm.tipo === 6) {
                  preguntaForm.opciones.sort((a, b) => {
                    return a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0;
                  });
                }
                if (preguntaForm.tipo === 10) {
                  preguntaForm.opciones.sort((a, b) => {
                    return a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0;
                  });
                }
                if (preguntaForm.tipo === 15) {
                  preguntaForm.opciones.sort((a, b) => {
                    return a.orden < b.orden ? -1 : a.orden > b.orden ? 1 : 0;
                  });
                }
                seccionesForm.preguntas.push(preguntaForm);
              });
              this.cuestionarioBack.push(seccionesForm);
              this.panelClassesBack.push({
                position: index,
                class: 'panel-white',
              });
            }
          );
          this.cuestionarioBack = this.cuestionarioBack.sort(
            (seccion1: { orden: number }, seccion2: { orden: number }) =>
              seccion1.orden < seccion2.orden
                ? -1
                : seccion1.orden > seccion2.orden
                ? 1
                : 0
          );
          console.log(this.cuestionarioBack);
          this.cuestionarioBack.forEach((cues: { preguntas: any[] }) => {
            if (cues.preguntas.length > 0) {
              cues.preguntas.sort((a: any, b: any) => {
                return a.orden < b.orden
                  ? -1
                  : a.orden > b.orden
                  ? 1
                  : a.label.toLowerCase() > b.label.toLowerCase()
                  ? 1
                  : a.label.toLowerCase() < b.label.toLowerCase()
                  ? -1
                  : 0;
              });
            }
          });
          this.cuestionarioForm.updateValueAndValidity();
          //console.log(this.cuestionarioBack);
          //console.log(this.cuestionarioForm);
          this.totalQuestions =
            Object.keys(this.cuestionarioForm.controls).length -
            this.answeredQuestions;
          this.answeredQuestions = 0;
          if (this.listaIds.length > 0) {
            this.listaIds.forEach((id) => {
              this.cuestionarioService
                .getListaById(id)
                .subscribe((resLista) => {
                  this.listas[id] = resLista;
                  if (this.listaIds.indexOf(id) == this.listaIds.length - 1) {
                    this.showFormTwo = true;
                    this.loading = false;
                  }
                });
            });
          } else {
            this.showFormTwo = true;
            this.loading = false;
          }
          this.cuestionarioForm.valueChanges.subscribe((d) => {
            let q = 0;
            Object.values(this.cuestionarioForm.controls).forEach((control) => {
              if (control.status == 'VALID') {
                q++;
              }
            });
            this.answeredQuestions = q;
            let porcentaje =
              (100 / this.totalQuestions) * this.answeredQuestions;
            this.progressBarWidth = `calc(${porcentaje}% - 2px)`;
            if (document.getElementById('inner-progress-bar')) {
              document.getElementById(
                'inner-progress-bar'
              )!.style.width = `calc(${porcentaje}% - 2px)`;
            }
          });
          this.cuestionarioForm.updateValueAndValidity();
          console.log(this.cuestionarioBack);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    this.rutaActiva.paramMap.subscribe((params: ParamMap) => {
      this.servicesTypeID = Number(params.get('servicesTypeID')!);
      this.workCenterID = Number(params.get('workCenterID')!);
      this.companyID = Number(params.get('companyID')!);
    });
  }

  ngAfterViewInit(): void {
    let q = 0;
    let disabled = 0;
    Object.values(this.cuestionarioForm.controls).forEach((control) => {
      if (control.status == 'VALID') {
        q++;
      }
      if (control.status == 'DISABLED') {
        disabled++;
      }
    });
    this.answeredQuestions = q;
    let allQuestions = 0;
    if (this.cuestionarioBack != undefined) {
      this.cuestionarioBack.forEach((sec: { preguntas: any[] }) => {
        allQuestions = allQuestions + sec.preguntas.length;
      });
    }
    allQuestions = allQuestions - disabled;
    let porcentaje = (100 / allQuestions) * this.answeredQuestions;
    this.progressBarWidth = `calc(${porcentaje}% - 2px)`;
    if (document.getElementById('inner-progress-bar')) {
      document.getElementById(
        'inner-progress-bar'
      )!.style.width = `calc(${porcentaje}% - 2px)`;
    }
  }

  returnBack() {
    this.router.navigate([this.returnUrl]);
  }

  returnToHome() {
    this.router.navigate(['dashboard/selectForm']);
  }

  finalizarFormulario() {
    if (this.cuestionarioForm.invalid) {
      this.openSnackBar(
        'Debe completar todos los campos y contestar todas las preguntas',
        'Cerrar',
        'warn-snackbar'
      );
      return;
    }

    this.loading = true;

    this.latitude = this.cuestionarioService.getLocation().latitude;
    this.longitude = this.cuestionarioService.getLocation().longitude;

    let model = {
      cuestionarioId: Number(this.cuestionarioId),
      fechaCarga: this.setDate(),
      latitud: this.latitude.toString(),
      longitud: this.longitude.toString(),
      rut: Number(this.currentUser),
      secciones: [] as Array<any>,
      respuestas_positivas: 0,
      respuestas_negativas: 0,
      info_gps: '',
    };
    if (this.cuestionarioService.getFirmaDatosAdicionales().length > 0) {
      Object.assign(model, {
        firmaDatosAdicionales:
          this.cuestionarioService.getFirmaDatosAdicionales(),
      });
    }
    this.cuestionarioBack.forEach(
      (seccion: {
        seccionId: any;
        preguntas: {
          preguntaId: any;
          tipo: any;
          control: any;
          opciones: [
            {
              valor: any;
              descripcion: any;
              id: any;
            }
          ];
        }[];
      }) => {
        let seccionEnviar = {
          seccionId: seccion.seccionId,
          preguntas: [] as Array<{}>,
        };
        seccion.preguntas.forEach(
          (pregunta: {
            preguntaId: any;
            tipo: any;
            control: any;
            opciones: [
              {
                valor: any;
                descripcion: any;
                id: any;
              }
            ];
          }) => {
            console.log(pregunta);
            let preguntaEnviar = {
              preguntaId: pregunta.preguntaId,
              preguntaTipo: pregunta.tipo,
              preguntaValor: this.cuestionarioForm
                .get(pregunta.control)!
                .value.toString(),
              preguntaOpcion: 0,
            };
            if (
              preguntaEnviar.preguntaTipo === 10 ||
              preguntaEnviar.preguntaTipo === 15
            ) {
              preguntaEnviar.preguntaOpcion = this.cuestionarioForm.get(
                pregunta.control
              )!.value;
              console.log(seccion);
              let findOpc = pregunta.opciones.find(
                (opc) => opc.id == preguntaEnviar.preguntaOpcion
              );
              preguntaEnviar.preguntaValor = findOpc?.valor.toString();
              if (findOpc!.valor == 0) {
                let find = this.cuestionarioService
                  .getFiles()
                  .find((file) => file.control == pregunta.control);
                console.log(find);
                Object.assign(preguntaEnviar, {
                  preguntaImagenId: find?.fileId,
                });
                Object.assign(preguntaEnviar, {
                  justificacion_imagen: find?.justificacion,
                });
              }
            } else if (preguntaEnviar.preguntaTipo === 14) {
              let find = this.cuestionarioService
                .getFiles()
                .find((file) => file.control == pregunta.control);
              Object.assign(preguntaEnviar, { preguntaImagenId: find?.fileId });
              preguntaEnviar.preguntaOpcion = pregunta.opciones[0].id;
              console.log(
                this.cuestionarioForm.get(pregunta.control)!.value.toString()
              );
              preguntaEnviar.preguntaValor = this.cuestionarioForm
                .get(pregunta.control)!
                .value.toString();
            } else if (preguntaEnviar.preguntaTipo === 16) {
              let find = this.cuestionarioService
                .getFiles()
                .find((file) => file.control == pregunta.control);
              Object.assign(preguntaEnviar, { preguntaImagenId: find?.fileId });
              preguntaEnviar.preguntaOpcion = pregunta.opciones[0].id;
              preguntaEnviar.preguntaValor = this.cuestionarioForm
                .get(pregunta.control)!
                .value.toString();
            } else if (preguntaEnviar.preguntaTipo === 6) {
              preguntaEnviar.preguntaOpcion = pregunta.opciones.find(
                (op) =>
                  op.descripcion ==
                  this.cuestionarioForm.get(pregunta.control)!.value
              )!.id;
            } else if (preguntaEnviar.preguntaTipo == 12) {
              let date = this.getDate(new Date(preguntaEnviar.preguntaValor));
              preguntaEnviar.preguntaValor = `${date}`;
              preguntaEnviar.preguntaOpcion = pregunta.opciones[0].id;
            } else {
              preguntaEnviar.preguntaOpcion = pregunta.opciones[0].id;
            }
            seccionEnviar.preguntas.push(preguntaEnviar);
          }
        );
        model.secciones.push(seccionEnviar);
      }
    );

    let scorePositive = 0;
    let scoreNegative = 0;
    model.secciones.forEach((sec) => {
      sec.preguntas.forEach(
        (pre: { preguntaTipo: number; preguntaValor: any }) => {
          if (pre.preguntaTipo == 10 || pre.preguntaTipo == 15) {
            console.log(pre);
            if (Number(pre.preguntaValor) != 0) {
              scorePositive++;
            } else {
              scoreNegative++;
            }
          }
        }
      );
    });
    model.respuestas_negativas = scoreNegative;
    model.respuestas_positivas = scorePositive;
    this.cuestionarioService.setScores({
      positive: scorePositive,
      negative: scoreNegative,
    });
    this.cuestionarioService.setUrl(this.router.url);
    console.log(model);

    //Check planificado
    if (this.planificado != 0 && this.actividad != 0) {
      let modelPlanificado = {
        titulo: this.cuestionarioBackTitle,
        formGroup: this.cuestionarioForm,
        respuestas: this.cuestionarioBack,
        control: 'pregunta1',
        panelClases: this.panelClassesBack,
        index: 1,
        seccion: this.cuestionarioBack[0],
        idCuestionario: this.cuestionarioId,
        planificado: this.planificado,
        idActividad: this.actividad,
      };
      this.cuestionarioService.setAnswerBack(modelPlanificado);
      if (this.latitude != 0 && this.longitude != 0) {
        model.info_gps = this.geolocationService.get();
        this.cuestionarioService.setPlanificadoFinalAnswer(model);
        this.router.navigate([
          '/dashboard/cuestionario/' +
            this.companyID +
            '/' +
            this.workCenterID +
            '/' +
            this.servicesTypeID +
            '/' +
            this.cuestionarioId +
            '/planificado',
        ]);
      } else {
        model.info_gps = 'Sin datos de ubicación';
        this.cuestionarioService.setPlanificadoFinalAnswer(model);
        this.router.navigate([
          '/dashboard/cuestionario/' +
            this.companyID +
            '/' +
            this.workCenterID +
            '/' +
            this.servicesTypeID +
            '/' +
            this.cuestionarioId +
            '/planificado',
        ]);
      }
    } else {
      if (this.latitude != 0 && this.longitude != 0) {
        model.info_gps = this.geolocationService.get();
        this.cuestionarioService.setPlanificadoFinalAnswer(model);
        this.router.navigate(['/dashboard/previewCuestionario']);
      } else {
        model.info_gps = 'Sin datos de ubicación';
        this.cuestionarioService.setPlanificadoFinalAnswer(model);
        this.router.navigate(['/dashboard/previewCuestionario']);
      }
    }
  }

  radioEventBack(event: any, control: string, seccion: any, index: number) {
    console.log(event.value);
    console.log(seccion);
    console.log(control);
    console.log(index);
    let find = seccion.preguntas
      .find((pre: { control: string }) => pre.control == control)
      .opciones.find((op: { id: any }) => op.id == event.value);
    if (find.valor == 0) {
      this.panelCloseBack(seccion, index);
      let titulo = seccion.preguntas.find(
        (pre: { control: string }) => pre.control == control
      ).label;
      let model = {
        titulo: this.cuestionarioBackTitle,
        formGroup: this.cuestionarioForm,
        respuestas: this.cuestionarioBack,
        control: control,
        panelClases: this.panelClassesBack,
        index: index,
        seccion: seccion,
        idCuestionario: this.cuestionarioId,
      };
      console.log(model);
      this.cuestionarioService.setAnswerBack(model);
      this.cuestionarioService.setQuestionTitle(titulo);
      this.router.navigate(['dashboard/justifyAnswer'], {
        queryParams: { returnUrl: this.router.url },
      });
    }
  }

  panelOpen(index: number) {
    this.panelOpenState = true;
    this.panelClasses[index].class = 'panel-white';
  }

  panelClose(index: number) {
    this.panelOpenState = false;
    if (index == 0) {
      if (
        this.cuestionarioForm.get('pregunta1')?.valid &&
        this.cuestionarioForm.get('pregunta2')?.valid &&
        this.cuestionarioForm.get('pregunta3')?.valid
      ) {
        this.panelClasses[index].class = 'panel-green';
      } else {
        this.panelClasses[index].class = 'panel-red';
      }
    } else if (index == 1) {
      if (
        this.cuestionarioForm.get('pregunta4')?.valid &&
        this.cuestionarioForm.get('pregunta5')?.valid &&
        this.cuestionarioForm.get('pregunta6')?.valid
      ) {
        this.panelClasses[index].class = 'panel-green';
      } else {
        this.panelClasses[index].class = 'panel-red';
      }
    } else {
      if (
        this.cuestionarioForm.get('fecha')?.valid &&
        this.cuestionarioForm.get('hora')?.valid
      ) {
        this.panelClasses[index].class = 'panel-green';
      } else {
        this.panelClasses[index].class = 'panel-red';
      }
    }
  }

  panelOpenBack(index: number) {
    this.panelOpenState = true;
    this.panelClassesBack[index].class = 'panel-white';
  }

  panelCloseBack(seccion: any, index: number) {
    this.panelOpenState = false;
    //console.log(seccion);
    //console.log(index);
    let error = false;
    seccion.preguntas.forEach((pregunta: { control: any }) => {
      if (
        this.cuestionarioForm.get(pregunta.control)?.valid ||
        this.cuestionarioForm.get(pregunta.control)?.disabled
      ) {
        return;
      } else {
        error = true;
      }
    });
    this.panelClassesBack[index].class = error ? 'panel-red' : 'panel-green';
  }

  uploadFoto(control: any) {
    window.document.getElementById(`camera${control}`)?.click();
  }

  openFoto(control: string) {
    let fileId = this.cuestionarioService
      .getFiles()
      .find((file) => file.control == control)!.fileId;
    const dialogRef = this.dialog.open(ArchivoCuestionarioModalComponent, {
      maxHeight: '85vh',
      height: 'auto',
      data: { id: fileId, type: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  file(event: any, control: string) {
    let extension =
      event.srcElement.files[0].name.split('.')[
        event.srcElement.files[0].name.split('.').length - 1
      ];
    let convProm: Promise<any>;
    if (
      extension != 'jpg' &&
      extension != 'heic' &&
      extension != 'heif' &&
      extension != 'webp' &&
      extension != 'jfif' &&
      extension != 'jpeg' &&
      extension != 'jpeg2000' &&
      extension != 'png' &&
      extension != 'svg' &&
      extension != 'bmp' &&
      extension != 'wmf' &&
      extension != 'mp4'
    ) {
      this.cuestionarioForm.get(control)?.setValue(null);
      this.openSnackBar('Extensión no admitida', 'X', 'warn-snackbar');
    } else {
      if (extension == 'heic' || extension == 'heif') {
        let heifFile = event.srcElement.files[0];
        let blob: Blob = event.srcElement.files[0];
        convProm = heic2any({ blob, toType: 'image/jpeg', quality: 0.2 })
          .then((jpgBlob: Blob | any) => {
            let newName = heifFile.name.replace(/\.[^/.]+$/, '.jpg');
            let finalFile = new File([jpgBlob], newName);
            if (event.srcElement.files.length > 0) {
              let find = this.cuestionarioService
                .getFiles()
                .find((file) => file.control == control);
              if (find == undefined) {
                this.fileService.subirArchivo(finalFile, 1).subscribe((d) => {
                  this.cuestionarioService.setFile({
                    control: control,
                    fileId: d.id,
                    justificacion: '',
                  });
                  this.cuestionarioForm.get(control)?.setValue(finalFile.name);
                  this.openSnackBar(d.message, 'X', 'success-snackbar');
                });
              } else {
                this.fileService
                  .actualizarArchivo(finalFile, find.fileId, 1)
                  .subscribe((d) => {
                    this.cuestionarioService.setFile({
                      control: control,
                      fileId: d.id,
                      justificacion: '',
                    });
                    this.cuestionarioForm
                      .get(control)
                      ?.setValue(finalFile.name);
                    this.openSnackBar(d.message, 'X', 'success-snackbar');
                  });
              }
            }
          })
          .catch((err) => {
            //Handle error
          });
      } else {
        if (event.srcElement.files.length > 0) {
          let name = event.srcElement.files[0].name;
          let find = this.cuestionarioService
            .getFiles()
            .find((file) => file.control == control);
          if (find == undefined) {
            this.fileService
              .subirArchivo(event.srcElement.files[0], 1)
              .subscribe((d) => {
                this.cuestionarioForm.get(control)?.setValue(name);
                this.cuestionarioService.setFile({
                  control: control,
                  fileId: d.id,
                  justificacion: '',
                });
                this.openSnackBar(d.message, 'X', 'success-snackbar');
              });
          } else {
            this.fileService
              .actualizarArchivo(event.srcElement.files[0], find.fileId, 1)
              .subscribe((d) => {
                this.cuestionarioForm.get(control)?.setValue(name);
                this.cuestionarioService.setFile({
                  control: control,
                  fileId: d.id,
                  justificacion: '',
                });
                this.openSnackBar(d.message, 'X', 'success-snackbar');
              });
          }
        }
      }
    }
  }

  sign(event: any, control: string, seccion: any, index: number) {
    console.log(event.value);
    console.log(seccion);
    console.log(control);
    console.log(index);
    this.panelCloseBack(seccion, index);
    let titulo = seccion.preguntas.find(
      (pre: { control: string }) => pre.control == control
    ).label;
    let model = {
      titulo: this.cuestionarioBackTitle,
      formGroup: this.cuestionarioForm,
      respuestas: this.cuestionarioBack,
      control: control,
      panelClases: this.panelClassesBack,
      index: index,
      seccion: seccion,
      idCuestionario: this.cuestionarioId,
    };
    console.log(model);
    this.cuestionarioService.setAnswerBack(model);
    this.cuestionarioService.setQuestionTitle(titulo);
    setTimeout(() => {
      this.router.navigate(['dashboard/preguntaFirma'], {
        queryParams: { returnUrl: this.router.url },
      });
    }, 20);
  }

  selectLista(event: any, listaId: number) {
    let modelListaMostrar = [] as Array<any>;
    let find = this.listas[listaId].lista.find(
      (lst: { id_fila: any }) => lst.id_fila == event.value
    );
    for (const [key, value] of Object.entries(find.descripciones)) {
      modelListaMostrar.push(value);
    }
    this.listaMostrar[listaId] = modelListaMostrar;
  }

  saveToCookies(form: any, id: number) {
    if (localStorage.getItem('cuestionarios') != null) {
      let model = JSON.parse(localStorage.getItem('cuestionarios')!);
      model.push({
        id: id,
        cuestionario: form,
      });
      localStorage.setItem('cuestionarios', JSON.stringify(model));
    } else {
      let model = [{ id: id, cuestionario: form }];
      localStorage.setItem('cuestionarios', JSON.stringify(model));
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className,
    });
  }

  /**
   * Retorna la fecha del usuario local en formato: DD-MM-YYYY
   * Añade un 0 si son menos de 10 dias para dar el formato 0D.
   * Añade un 0 si son menos de 10 meses para dar el formato 0M.
   * Opcionalmente puede recibir una fecha.
   * @returns string: representa la fecha del dispositivo del usuario.
   */
  private getDate(d?: Date): string {
    let date = new Date();
    if (d) date = d;

    let year: number = date.getFullYear();

    let day: string | number = date.getDate();
    if (date.getDay() < 10) day = `0${date.getDay()}`;

    let month: string | number = date.getMonth() + 1;
    if (date.getMonth() < 10) day = `0${date.getMonth()}`;

    return `${day} - ${month} - ${year}`;
  }

  /**
   * Retorna la fecha y hora del usuario local.
   * @returns Date: representa la hora del usuario menos el GMT del usuario.
   */
  private setDate(): Date {
    let date = new Date();
    let hours = date.getHours();
    let gmt = date.getTimezoneOffset() / 60;
    gmt > 0 ? (hours -= gmt) : (hours += gmt);
    date = new Date(date.setHours(hours));
    return date;
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
}

@Component({
  selector: 'cuestionario-modal',
  template: `<div>
    <img
      [src]="imgSrc"
      class="ml-auto mr-auto rounded"
      style="max-height: 70vh; max-width: 70vw"
      alt=""
      *ngIf="imgSrc != '' && type == 'image'"
    />
    <video
      [src]="imgSrc"
      controls
      style="max-height: 70vh; max-width: 70vw"
      *ngIf="imgSrc != '' && type == 'video'"
    ></video>
    <h2 *ngIf="type == 'text'">TEXT</h2>
    <div *ngFor="let firmaData of additionalData">
      <b>{{ firmaData.title }} : </b>{{ firmaData.valor }}
    </div>
    <mat-spinner *ngIf="imgSrc == ''"></mat-spinner>
  </div>`,
})
export class ArchivoCuestionarioModalComponent implements OnInit {
  imgSrc: any = '';
  type: string = '';
  additionalData = [] as Array<any>;
  show: boolean = false;

  constructor(
    private fileService: FilesService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ArchivoCuestionarioModalComponent>,
    private cuestionarioService: CuestionarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data.additionalData);
    if (this.data.type == '') {
      this.fileService.traerArchivo(this.data.id, 1).subscribe((d) => {
        let blob = this.fileService.b64toBlob(
          d.file,
          this.fileService.getFileType(d.fileName)
        );
        this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
        if (this.fileService.getFileType(d.fileName) == 'image/jpeg') {
          this.type = 'image';
          if (this.data.additionalData) {
            this.cuestionarioService
              .getFirmaDatoAdicional(this.data.additionalData[0].id_pregunta)
              .subscribe((d) => {
                console.log(d);
                this.additionalData = this.data.additionalData;
                this.additionalData.forEach((x: { orden: number }) => {
                  Object.assign(x, {
                    title: d.firmaDatoAdicional.find(
                      (firma: { orden: number }) => firma.orden == x.orden
                    ).descripcion,
                  });
                });
                console.log(this.additionalData);
              });
          }
        } else {
          this.type = 'video';
        }
        this.show = true;
      });
    } else {
      //TEXTO
      this.type = 'text';
    }
  }
}
