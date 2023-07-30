import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CompanyUserModel} from '../interfaces/company-user';
import { WorkCenterModel } from '../interfaces/work-center';
import { CriticTaskModel } from '../interfaces/critc-task';
import { UsuariosService } from '../services/usuarios.service';
import { ServiceTypeModel } from '../interfaces/service-type';
import { UserModel } from '../interfaces/user';
import { CuestionarioModel } from '../interfaces/cuestionario';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public UsuariosService: UsuariosService, public router : Router) { }

  ngOnInit(): void {
    this.GetCuestionariosUsuarioLogueado();
  }

  GetCuestionariosUsuarioLogueado(): void {
    this.UsuariosService.getCuestionarios().subscribe({ 
      next: (data) => {
        let mappingEstructura = MappingData(data);
        console.log(mappingEstructura);
        sessionStorage.setItem('estructuraCuestionarios',  JSON.stringify(mappingEstructura));
        if (mappingEstructura.companyUser.length==1){    
          this.router.navigate(['dashboard/workCenters', mappingEstructura.companyUser[0].id]);
        }
        else
            this.router.navigate(['dashboard/companies']);
      }, 
      error: (err) => {
        // Si sucede un error
      }
    });
  }
}
 function MappingData(data: number) :UserModel {

const cuestionario =new CuestionarioModel();
cuestionario.id= 1;
cuestionario.name = 'cuestionario 1';
const cuestionario2 =new CuestionarioModel();
cuestionario2.id= 2;
cuestionario2.name = 'cuestionario 2';
const cuestionario3 =new CuestionarioModel();
cuestionario3.id= 3;
cuestionario3.name = 'cuestionario 3';

const cuestionario4 =new CuestionarioModel();
cuestionario4.id= 4;
cuestionario4.name = 'cuestionario 4';

const cuestionarioAseoVehiculoInterior=new CuestionarioModel();
cuestionarioAseoVehiculoInterior.id= 5;
cuestionarioAseoVehiculoInterior.name = 'cuestionario 5';
const cuestionarioAseoVehiculoExterior =new CuestionarioModel();
cuestionarioAseoVehiculoExterior.id= 6
cuestionarioAseoVehiculoExterior.name = 'cuestionario 6';
const arrayCuestionariosAseoVehiculoInterior : CuestionarioModel[] = [];
const arrayCuestionariosAseoVehiculoExterior : CuestionarioModel[] = [];
arrayCuestionariosAseoVehiculoInterior.push(cuestionarioAseoVehiculoInterior);
arrayCuestionariosAseoVehiculoExterior.push(cuestionarioAseoVehiculoExterior);


const arrayCuestionarios : CuestionarioModel[] = [];
arrayCuestionarios.push(cuestionario);
arrayCuestionarios.push(cuestionario2);
arrayCuestionarios.push(cuestionario3);


const cuestionarioHoteleria1=new CuestionarioModel();
cuestionarioHoteleria1.id= 6;
cuestionarioHoteleria1.name = 'cuestionario 6';
const cuestionarioHoteleria2=new CuestionarioModel();
cuestionarioHoteleria2.id= 7;
cuestionarioHoteleria2.name = 'cuestionario 7';

const arrayCuestionariosHoteleria1 :  CuestionarioModel[] = [];
arrayCuestionariosHoteleria1.push(cuestionarioHoteleria1);

const arrayCuestionariosHoteleria2 :  CuestionarioModel[] = [];
arrayCuestionariosHoteleria2.push(cuestionarioHoteleria2);


const arrayCuestionariosAlmuerzoP1 :  CuestionarioModel[] = [];
arrayCuestionariosAlmuerzoP1.push(cuestionario4);

const arrayCriticTaskAlimentacion : CriticTaskModel[]  = [];
const criticTask = new CriticTaskModel();
criticTask.id= 1;
criticTask.name = 'S ALMUERZO C460 y C1000';
criticTask.cuestionarios = arrayCuestionarios;

const criticTaskALMUERZOP1 = new CriticTaskModel();
criticTaskALMUERZOP1.id= 2;
criticTaskALMUERZOP1.name = 'S ALMUERZO P1, P2, P3, LL1, LL2, LL3';
criticTaskALMUERZOP1.cuestionarios = arrayCuestionariosAlmuerzoP1;


const arrayCriticTaskAseo : CriticTaskModel[]  = [];
const criticTaskAseoInterno= new CriticTaskModel();
criticTaskAseoInterno.id= 3;
criticTaskAseoInterno.name = 'ASEO Interno';
criticTaskAseoInterno.cuestionarios = arrayCuestionariosAseoVehiculoInterior;

const criticTaskAseoExterior= new CriticTaskModel();
criticTaskAseoExterior.id= 4;
criticTaskAseoExterior.name = 'ASEO Externo';
criticTaskAseoExterior.cuestionarios = arrayCuestionariosAseoVehiculoExterior;


arrayCriticTaskAlimentacion.push(criticTask);
arrayCriticTaskAlimentacion.push(criticTaskALMUERZOP1);
arrayCriticTaskAseo.push(criticTaskAseoExterior);
arrayCriticTaskAseo.push(criticTaskAseoInterno);


const arrayCriticTaskHoteleria : CriticTaskModel[]  = [];

const criticTaskHoteleria1= new CriticTaskModel();
criticTaskHoteleria1.id= 5;
criticTaskHoteleria1.name = 'Hoteleria 1';
criticTaskHoteleria1.cuestionarios = arrayCuestionariosHoteleria1;

const criticTaskHoteleria2= new CriticTaskModel();
criticTaskHoteleria2.id= 6;
criticTaskHoteleria2.name = 'Hoteleria 2';
criticTaskHoteleria2.cuestionarios = arrayCuestionariosHoteleria2;

arrayCriticTaskHoteleria.push(criticTaskHoteleria1);
arrayCriticTaskHoteleria.push(criticTaskHoteleria2);


// tipos de servicios 
const serviceTypeAlimentacion = new ServiceTypeModel();
serviceTypeAlimentacion.id = 1
serviceTypeAlimentacion.name='Alimentacion';
serviceTypeAlimentacion.criticTasks= arrayCriticTaskAlimentacion;


const serviceTypeAseo = new ServiceTypeModel();
serviceTypeAseo.id = 2
serviceTypeAseo.name='Aseo';
serviceTypeAseo.criticTasks= arrayCriticTaskAseo;


const serviceTypeHoteleria = new ServiceTypeModel();
serviceTypeHoteleria.id = 3
serviceTypeHoteleria.name='Hoteleria';
serviceTypeHoteleria.criticTasks= arrayCriticTaskHoteleria;


const arrayservicesTypeCOPOSA : ServiceTypeModel[]  = [];
arrayservicesTypeCOPOSA.push(serviceTypeAlimentacion);
arrayservicesTypeCOPOSA.push(serviceTypeAseo);


const arrayservicesTypePATACHE : ServiceTypeModel[]  = [];
arrayservicesTypePATACHE.push(serviceTypeHoteleria);


// centros  de trabajo
const workCenterCOPOSA = new WorkCenterModel();
workCenterCOPOSA.id = 1
workCenterCOPOSA.name='COPOSA';
workCenterCOPOSA.servicesTypes= arrayservicesTypeCOPOSA;

const workCenterPATACHE = new WorkCenterModel();
workCenterPATACHE.id = 2
workCenterPATACHE.name='PATACHE';
workCenterPATACHE.servicesTypes= arrayservicesTypePATACHE;

const workCenterPUMA = new WorkCenterModel();
workCenterPUMA.id = 3
workCenterPUMA.name='460';
workCenterPUMA.servicesTypes= arrayservicesTypeCOPOSA;

const workCenterNIKE = new WorkCenterModel();
workCenterNIKE.id = 3
workCenterNIKE.name='460';
workCenterNIKE.servicesTypes= arrayservicesTypeCOPOSA;

const arrayWorkCenter : WorkCenterModel[]  = [];
arrayWorkCenter.push(workCenterPUMA);
arrayWorkCenter.push(workCenterCOPOSA);
arrayWorkCenter.push(workCenterPATACHE);


const companyUser = new CompanyUserModel();
companyUser.id = 1
companyUser.name='COLLAHUASI';
companyUser.workCenters= arrayWorkCenter;


const companyUser2 = new CompanyUserModel();
companyUser2.id = 2
companyUser2.name='COCA';
companyUser2.workCenters= arrayWorkCenter;

const companyUser3 = new CompanyUserModel();
companyUser3.id = 3
companyUser3.name='NIKE';
companyUser3.workCenters= arrayWorkCenter;

const arrayCompanyUser : CompanyUserModel[]  = [];
arrayCompanyUser.push(companyUser);
arrayCompanyUser.push(companyUser2);
arrayCompanyUser.push(companyUser3);

const user = new UserModel();
user.id = 1
user.name='UsuarioCollahuasi';
user.companyUser= arrayCompanyUser;

console.log(user)
return user;

}


