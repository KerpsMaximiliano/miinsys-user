import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ChangePasswordDialog } from 'src/app/auth/change-password-dialog/change-password-dialog.component';
import { CompanyUserModel } from 'src/app/interfaces/company-user';
import { CriticTaskModel } from 'src/app/interfaces/critc-task';
import { CuestionarioModel } from 'src/app/interfaces/cuestionario';
import { ServiceTypeModel } from 'src/app/interfaces/service-type';
import { UserModel } from 'src/app/interfaces/user';
import { WorkCenterModel } from 'src/app/interfaces/work-center';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { routeTransitionAnimations } from './route-transition-animations';

@Component({
  selector: 'app-selectable-items',
  templateUrl: './selectable-items.component.html',
  styleUrls: ['./selectable-items.component.scss'],
  animations: [routeTransitionAnimations]
})
export class SelectableItemsComponent implements OnInit {

  servicesTypeID: number = 0;
  workCenterID: number = 0;
  companyID: number = 0;
  groupId: number = 0;
  plantId: number = 0;
  cuestionarioID: number = 0;
  footerButtons: boolean = false;
  returnUrl: string = '';
  titulo: string = '';
  styleObj = {};
  companyLogo: string = "";
  modalBack: boolean = false;
  modalHome: boolean = false;
  showUserIcon: boolean = false;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
      
    }

  ngOnInit(): void {
    this.usuariosService.checkTokenExpiration();
    this.usuariosService.getCuestionarios().subscribe({
      next: (data) => {
        let mappingEstructura;
        if(sessionStorage.getItem('currentTree') != null && sessionStorage.getItem('currentTree') != undefined && sessionStorage.getItem('currentTree')!.length != 0) {
          mappingEstructura = mappingDataBackend();
        } else {
          mappingEstructura = MappingData(data);
        }
        //console.log(mappingEstructura);
        sessionStorage.setItem('estructuraCuestionarios', JSON.stringify(mappingEstructura));
        // if (mappingEstructura.companyUser.length == 1) {
        //   this.router.navigate(['dashboard/workCenters', mappingEstructura.companyUser[0].id]);
        // }
        // else
        //   this.router.navigate(['dashboard/companies']);
        //this.router.navigate(['dashboard/companies']);
        //this.router.navigate(['dashboard/cuestionario/1/1/1/1']);
        console.log(JSON.parse(sessionStorage.getItem('arbol')!).empresasDto)
        // if(JSON.parse(sessionStorage.getItem('arbol')!).empresasDto.length > 1) {
        //   this.router.navigate(['dashboard/selectBusiness']);
        // } else {
        //   this.router.navigate(['dashboard/selectForm/' + JSON.parse(sessionStorage.getItem('arbol')!).empresasDto[0].emp_id]);
        // }
        
      },
      error: (err) => {
        // Si sucede un error
      }
    });
  }


  returnBack() {
    this.router.navigate([this.returnUrl]);
  }

  returnToHome() {
    this.router.navigate(['dashboard/companies']);
  }

  componentLoaded(component: any) {
    this.usuariosService.checkTokenExpiration();
    this.modalBack = false;
    this.modalHome = false;
    this.showUserIcon = false;
    //console.log(component)
    switch (component.component) {
      

      case 'SelectBusiness':
        this.groupId = 0;
        this.companyID = 0;
        this.footerButtons = false;
        this.showUserIcon = true;
        this.titulo = "Seleccionar Empresa";
        this.styleObj = '';
        this.companyLogo = '';
        break;

      case 'SelectPlant':
        this.companyID = this.rutaActiva.children[0].snapshot.params['empresaId'];
        this.footerButtons = true;
        this.showUserIcon = true;
        this.titulo = "";
        this.styleObj = '';
        this.companyLogo = '';
        this.returnUrl = "dashboard/selectBusiness/";
        break;

      case 'SelectGroup':
        this.companyID = this.rutaActiva.children[0].snapshot.params['empresaId'];
        this.plantId = this.rutaActiva.children[0].snapshot.params['plantaId'];
        this.footerButtons = true;
        this.showUserIcon = true;
        this.titulo = "";
        this.styleObj = '';
        this.companyLogo = '';
        if(this.plantId == 0) {
          this.returnUrl = "dashboard/selectBusiness/";
        } else {
          this.returnUrl = "dashboard/selectPlant/" + this.companyID;
        }
        break;

      case 'SelectForm':
        this.companyID = this.rutaActiva.children[0].snapshot.params['empresaId'];
        this.plantId = this.rutaActiva.children[0].snapshot.params['plantaId'];
        this.groupId = this.rutaActiva.children[0].snapshot.params['groupId'];
        this.showUserIcon = true;
        this.titulo = "";
        this.styleObj = '';
        this.companyLogo = '';
        console.log(JSON.parse(sessionStorage.getItem('arbol')!).empresasDto);
        if(JSON.parse(sessionStorage.getItem('arbol')!).empresasDto.length > 1) {
          if(this.groupId == 0) {
            if(this.plantId == 0) {
              this.returnUrl = "dashboard/selectBusiness";
            } else {
              this.returnUrl = "dashboard/selectPlant/" + this.companyID;
            }
          } else {
            this.returnUrl = "dashboard/selectGroup/" + this.companyID + "/" + this.plantId;
          }
          this.footerButtons = true;
        } else {
          if(this.groupId == 0) {
            if(this.plantId == 0) {
              this.returnUrl = "dashboard/selectBusiness";
            } else {
              this.returnUrl = "dashboard/selectPlant/" + this.companyID;
            }
          } else {
            this.returnUrl = "dashboard/selectGroup/" + this.companyID + "/" + this.plantId;
          }
          this.footerButtons = true;
        }
        break;

      case 'CompanyUser':
        this.footerButtons = false;
        this.titulo = "Empresas";
        this.styleObj = '';
        this.companyLogo = '';
        break;

      case 'WorkCenter':
        this.footerButtons = true;
        this.returnUrl = "dashboard/companies";
        this.titulo = "CENTRO DE TRABAJO";
        this.companyID = this.rutaActiva.children[0].snapshot.params['companyID'];
        if(this.companyID == 3) {
          this.styleObj = 'nike'
          this.companyLogo = '../assets/images/icon/nike-logo.png';
        }
        if(this.companyID == 1) {
          this.companyLogo = '../assets/images/icon/collahuasi-300x240.jpg';
        }
        break;

      case 'ServicesType': 
        this.footerButtons = true;
        this.returnUrl = "dashboard/workCenters" + "/"  + this.companyID;
        this.titulo = "TIPO DE SERVICIO";
        break;

      case 'CriticTask':
        this.footerButtons = true;
        this.workCenterID = this.rutaActiva.children[0].snapshot.params['workCenterID'];
        this.returnUrl = "dashboard/servicesTypes" + "/"+ this.companyID +  "/" + this.workCenterID;
        this.servicesTypeID = this.rutaActiva.children[0].snapshot.params['servicesTypeID'];
        this.titulo = "ACTIVIDAD CRÍTICA";
        break;

      case 'CuestionarioTemplate':
        this.companyID = this.rutaActiva.children[0].snapshot.params['companyID'];
        this.plantId = this.rutaActiva.children[0].snapshot.params['plantaId'];
        this.groupId = this.rutaActiva.children[0].snapshot.params['groupId'];
        this.footerButtons = true;
        this.returnUrl = "dashboard/selectForm/" + this.companyID + "/" + this.plantId + "/" + this.groupId;
        this.titulo = "Formulario";
        this.modalHome = true;
        break;

      case 'CuestionarioSimpleTemplate':
        this.footerButtons = true;
        this.returnUrl = "dashboard/criticTask" + "/" + this.companyID +  "/" + this.workCenterID +  "/" + this.servicesTypeID;
        this.cuestionarioID = this.rutaActiva.children[0].snapshot.params['cuestionarioID'];
        this.titulo = "Formulario Simple";
        this.modalBack = true;
        this.modalHome = true;
        break;

      case 'CuestionarioSend':
        this.footerButtons = true;
        //this.returnUrl = this.returnUrl = "dashboard/criticTask" + "/" + this.companyID +  "/" + this.workCenterID +  "/" + this.servicesTypeID;
        this.returnUrl = 'dashboard/selectGroup/' + this.companyID;
        this.titulo = "Formulario Enviado";
        break;

      case 'CuestionarioPreview':
        this.footerButtons = true;
        this.returnUrl = "dashboard/cuestionario" + "/" + this.companyID +  "/" + this.workCenterID +  "/" + this.servicesTypeID + "/" + this.cuestionarioID;
        //this.returnUrl = 'dashboard/selectBusiness/';
        this.titulo = "Resumen respuestas";
        break;

      case 'JustificarRespuestaFoto':
        this.footerButtons = true;
        this.returnUrl = "dashboard/cuestionario" + "/" + this.companyID +  "/" + this.workCenterID +  "/" + this.servicesTypeID + "/" + this.cuestionarioID;
        this.titulo = "";
        break;

      case 'PreguntaFirma':
        this.footerButtons = true;
        this.returnUrl = "dashboard/cuestionario" + "/" + this.companyID + "/" + this.workCenterID + "/" + this.servicesTypeID + "/" + this.cuestionarioID;
        this.titulo = "";
        break;

      case 'PlanificadoSignature':
        this.footerButtons = true;
        this.returnUrl = "dashboard/cuestionario" + "/" + this.companyID +  "/" + this.workCenterID +  "/" + this.servicesTypeID + "/" + this.cuestionarioID;
        this.titulo = "Cuestionario planificado";
        break;
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '85%',
      height: '85%',
      data: { username: JSON.parse(sessionStorage.getItem('usuarioLogueado')!).username }
    });
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

}

function MappingData(data: number): UserModel {
  const cuestionario = new CuestionarioModel();
  cuestionario.id = 1;
  cuestionario.name = 'cuestionario 1';
  const cuestionario2 = new CuestionarioModel();
  cuestionario2.id = 2;
  cuestionario2.name = 'cuestionario 2';
  const cuestionario3 = new CuestionarioModel();
  cuestionario3.id = 3;
  cuestionario3.name = 'cuestionario 3';

  const cuestionario4 = new CuestionarioModel();
  cuestionario4.id = 4;
  cuestionario4.name = 'cuestionario 4';

  const cuestionarioAseoVehiculoInterior = new CuestionarioModel();
  cuestionarioAseoVehiculoInterior.id = 5;
  cuestionarioAseoVehiculoInterior.name = 'cuestionario 5';
  const cuestionarioAseoVehiculoExterior = new CuestionarioModel();
  cuestionarioAseoVehiculoExterior.id = 6
  cuestionarioAseoVehiculoExterior.name = 'cuestionario 6';
  const arrayCuestionariosAseoVehiculoInterior: CuestionarioModel[] = [];
  const arrayCuestionariosAseoVehiculoExterior: CuestionarioModel[] = [];
  arrayCuestionariosAseoVehiculoInterior.push(cuestionarioAseoVehiculoInterior);
  arrayCuestionariosAseoVehiculoExterior.push(cuestionarioAseoVehiculoExterior);


  const arrayCuestionarios: CuestionarioModel[] = [];
  arrayCuestionarios.push(cuestionario);
  arrayCuestionarios.push(cuestionario2);
  arrayCuestionarios.push(cuestionario3);


  const cuestionarioHoteleria1 = new CuestionarioModel();
  cuestionarioHoteleria1.id = 6;
  cuestionarioHoteleria1.name = 'cuestionario 6';
  const cuestionarioHoteleria2 = new CuestionarioModel();
  cuestionarioHoteleria2.id = 7;
  cuestionarioHoteleria2.name = 'cuestionario 7';
  const cuestionarioHoteleria3 = new CuestionarioModel();
  cuestionarioHoteleria3.id = 8;
  cuestionarioHoteleria3.name = 'cuestionario 8';

  const arrayCuestionariosHoteleria1: CuestionarioModel[] = [];
  arrayCuestionariosHoteleria1.push(cuestionarioHoteleria1);

  const arrayCuestionariosHoteleria2: CuestionarioModel[] = [];
  arrayCuestionariosHoteleria2.push(cuestionarioHoteleria2);

  const arrayCuestionariosHoteleria3: CuestionarioModel[] = [];
  arrayCuestionariosHoteleria3.push(cuestionarioHoteleria3);


  const arrayCuestionariosAlmuerzoP1: CuestionarioModel[] = [];
  arrayCuestionariosAlmuerzoP1.push(cuestionario4);

  const arrayCriticTaskAlimentacion: CriticTaskModel[] = [];
  const criticTask = new CriticTaskModel();
  criticTask.id = 1;
  //criticTask.name = 'S ALMUERZO C460 y C1000';
  criticTask.name = 'Formulario 1';
  criticTask.cuestionarios = arrayCuestionarios;

  const criticTaskALMUERZOP1 = new CriticTaskModel();
  criticTaskALMUERZOP1.id = 2;
  //criticTaskALMUERZOP1.name = 'S ALMUERZO P1, P2, P3, LL1, LL2, LL3';
  criticTaskALMUERZOP1.name = 'Formulario 2';
  criticTaskALMUERZOP1.cuestionarios = arrayCuestionariosAlmuerzoP1;


  const arrayCriticTaskAseo: CriticTaskModel[] = [];
  const criticTaskAseoInterno = new CriticTaskModel();
  criticTaskAseoInterno.id = 3;
  //criticTaskAseoInterno.name = 'ASEO Interno';
  criticTaskAseoInterno.name = 'Formulario 3';
  criticTaskAseoInterno.cuestionarios = arrayCuestionariosAseoVehiculoInterior;

  const criticTaskAseoExterior = new CriticTaskModel();
  criticTaskAseoExterior.id = 4;
  //criticTaskAseoExterior.name = 'ASEO Externo';
  criticTaskAseoExterior.name = 'Formulario 4';
  criticTaskAseoExterior.cuestionarios = arrayCuestionariosAseoVehiculoExterior;


  arrayCriticTaskAlimentacion.push(criticTask);
  arrayCriticTaskAlimentacion.push(criticTaskALMUERZOP1);
  arrayCriticTaskAseo.push(criticTaskAseoExterior);
  arrayCriticTaskAseo.push(criticTaskAseoInterno);


  const arrayCriticTaskHoteleria: CriticTaskModel[] = [];

  const criticTaskHoteleria1 = new CriticTaskModel();
  criticTaskHoteleria1.id = 5;
  criticTaskHoteleria1.name = 'Hoteleria 1';
  criticTaskHoteleria1.cuestionarios = arrayCuestionariosHoteleria1;

  const criticTaskHoteleria2 = new CriticTaskModel();
  criticTaskHoteleria2.id = 6;
  criticTaskHoteleria2.name = 'Hoteleria 2';
  criticTaskHoteleria2.cuestionarios = arrayCuestionariosHoteleria2;

  const criticTaskHoteleria3 = new CriticTaskModel();
  criticTaskHoteleria3.id = 7;
  criticTaskHoteleria3.name = 'Hoteleria 3 - Simple';
  criticTaskHoteleria3.cuestionarios = arrayCuestionariosHoteleria3;

  arrayCriticTaskHoteleria.push(criticTaskHoteleria1);
  arrayCriticTaskHoteleria.push(criticTaskHoteleria2);
  arrayCriticTaskHoteleria.push(criticTaskHoteleria3);


  // tipos de servicios 
  const serviceTypeAlimentacion = new ServiceTypeModel();
  serviceTypeAlimentacion.id = 1
  //serviceTypeAlimentacion.name = 'Alimentacion';
  serviceTypeAlimentacion.name = 'Servicio 1';
  serviceTypeAlimentacion.criticTasks = arrayCriticTaskAlimentacion;


  const serviceTypeAseo = new ServiceTypeModel();
  serviceTypeAseo.id = 2
  //serviceTypeAseo.name = 'Aseo';
  serviceTypeAseo.name = 'Servicio 2';
  serviceTypeAseo.criticTasks = arrayCriticTaskAseo;


  const serviceTypeHoteleria = new ServiceTypeModel();
  serviceTypeHoteleria.id = 3
  serviceTypeHoteleria.name = 'Hoteleria';
  serviceTypeHoteleria.criticTasks = arrayCriticTaskHoteleria;


  const arrayservicesTypeCOPOSA: ServiceTypeModel[] = [];
  arrayservicesTypeCOPOSA.push(serviceTypeAlimentacion);
  arrayservicesTypeCOPOSA.push(serviceTypeAseo);


  const arrayservicesTypePATACHE: ServiceTypeModel[] = [];
  arrayservicesTypePATACHE.push(serviceTypeHoteleria);


  // centros  de trabajo
  const workCenterCOPOSA = new WorkCenterModel();
  workCenterCOPOSA.id = 1
  //workCenterCOPOSA.name = 'COPOSA';
  workCenterCOPOSA.name = 'Centro de trabajo 1';
  workCenterCOPOSA.servicesTypes = arrayservicesTypeCOPOSA;

  const workCenterPATACHE = new WorkCenterModel();
  workCenterPATACHE.id = 2
  //workCenterPATACHE.name = 'PATACHE';
  workCenterPATACHE.name = 'Centro de trabajo 2';
  workCenterPATACHE.servicesTypes = arrayservicesTypePATACHE;

  const workCenterPUMA = new WorkCenterModel();
  workCenterPUMA.id = 3
  //workCenterPUMA.name = '460';
  workCenterPUMA.name = 'Centro de trabajo 3';
  workCenterPUMA.servicesTypes = arrayservicesTypeCOPOSA;

  const workCenterNIKE = new WorkCenterModel();
  workCenterNIKE.id = 3
  //workCenterNIKE.name = '460';
  workCenterNIKE.name = 'Centro de trabajo 3';
  workCenterNIKE.servicesTypes = arrayservicesTypeCOPOSA;

  const arrayWorkCenter: WorkCenterModel[] = [];
  arrayWorkCenter.push(workCenterPUMA);
  arrayWorkCenter.push(workCenterCOPOSA);
  arrayWorkCenter.push(workCenterPATACHE);


  const companyUser = new CompanyUserModel();
  companyUser.id = 1
  companyUser.name = 'COLLAHUASI';
  companyUser.workCenters = arrayWorkCenter;


  const companyUser2 = new CompanyUserModel();
  companyUser2.id = 2
  companyUser2.name = 'COCA';
  companyUser2.workCenters = arrayWorkCenter;

  const companyUser3 = new CompanyUserModel();
  companyUser3.id = 3
  companyUser3.name = 'NIKE';
  companyUser3.workCenters = arrayWorkCenter;

  const arrayCompanyUser: CompanyUserModel[] = [];
  arrayCompanyUser.push(companyUser);
  arrayCompanyUser.push(companyUser2);
  arrayCompanyUser.push(companyUser3);

  const user = new UserModel();
  user.id = 1
  user.name = 'UsuarioCollahuasi';
  user.companyUser = arrayCompanyUser;

  //console.log(user)
  return user;
}

function mappingDataBackend() {
  //console.log(JSON.parse(sessionStorage.getItem('currentTree')!));
  let arbolInicial = JSON.parse(sessionStorage.getItem('currentTree')!);
  let arbolFinal: UserModel = {
    id: arbolInicial.$id,
    name: "",
    companyUser : [] //Empresas
  };

  arbolInicial.$values.forEach((empresa: { emp_id: any; emp_descripcion: any; centroTrabajo: { $values: any[]; }; }) => {
    //Empresas - CompanyUsers
    let empresaFinal: CompanyUserModel = {
      id: empresa.emp_id,
      name: empresa.emp_descripcion,
      workCenters: []
    };
    empresa.centroTrabajo.$values.forEach(centroTrabajo => {
      //Centros de trabajo - WorkCenters
      let centroTrabajoFinal: WorkCenterModel = {
        id: centroTrabajo.id,
        name: centroTrabajo.titulo,
        descripcion: centroTrabajo.descripcion,
        nivel: centroTrabajo.nivel,
        orden: centroTrabajo.orden,
        cuestionario_id: centroTrabajo.cuestionario_id,
        servicesTypes: []
      };
      centroTrabajo.arbolMenuDto.$values.forEach((tiposServicios: { id: any; titulo: any; descripcion: any; nivel: any; orden: any; cuestionario_id: any; arbolMenuDto: { $values: any[]; }; }) => {
        //arbolMenuDto1 - ServicesTypes
        let tiposServiciosFinal: ServiceTypeModel = {
          id: tiposServicios.id,
          name: tiposServicios.titulo,
          descripcion: tiposServicios.descripcion,
          nivel: tiposServicios.nivel,
          orden: tiposServicios.orden,
          cuestionario_id: tiposServicios.cuestionario_id,
          criticTasks: []
        };
        tiposServicios.arbolMenuDto.$values.forEach(tareasCriticas => {
          //arbolMenuDto2 - CriticTasks
          let tareasCriticasFinal: CriticTaskModel = {
            id: tareasCriticas.id,
            name: tareasCriticas.titulo,
            descripcion: tareasCriticas.descripcion,
            nivel: tareasCriticas.nivel,
            orden: tareasCriticas.orden,
            cuestionario_id: tareasCriticas.cuestionario_id,
            cuestionarios: []
          };
          tiposServiciosFinal.criticTasks.push(tareasCriticasFinal);
        });

        centroTrabajoFinal.servicesTypes.push(tiposServiciosFinal);
      });

      empresaFinal.workCenters.push(centroTrabajoFinal);
    })

    arbolFinal.companyUser.push(empresaFinal);
  });
  //console.log(arbolFinal)
  return arbolFinal;
}

/*

companyUser -> empresasDto
workCenters -> centroTrabajo
servicesTypes -> primer arbolMenuDto
criticTasks -> segundo arbolMenuDto // Este ya trae cada item con un cuestionario_id

*/