import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceTypeModel } from '../../interfaces/service-type';
import { UserModel } from 'src/app/interfaces/user';
import { WorkCenterModel } from '../../interfaces/work-center';
@Component({
  selector: 'app-services-type',
  templateUrl: './services-type.component.html',
  styleUrls: ['./services-type.component.css']
})
export class ServicesTypeComponent implements OnInit {
  component: string = 'ServicesType';
  idWorkCenter : number = 0;
  idCompany : number = 0;
  returnUrl: string='';

  constructor(private rutaActiva: ActivatedRoute, private router :Router) { }
  
  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe(
      (params: ParamMap) => {
        this.idWorkCenter = Number(params.get('id')!);
        this.idCompany = Number(params.get('companyID')!);
      }
    );

    this.returnUrl = "dashboard/workCenters" + "/"  + this.idCompany;
    // this.rutaActiva.params.subscribe(
    //   (params: Params) => {
    //     this.idWorkCenter = Number(params['id']!);
    //   }
    // );
  }
  returnBack()
  {
    this.router.navigate([this.returnUrl]);  
  }
  returnToHome()
  {
    this.router.navigate(['dashboard/companies']);  
  }
  
  getServicesTypes() : ServiceTypeModel[]
  {
    const estructuraCuestionarios : UserModel = JSON.parse(sessionStorage.getItem('estructuraCuestionarios')!);
    const workCenter : WorkCenterModel[] = estructuraCuestionarios.companyUser.find(x=>x.id==this.idCompany)!.workCenters;
    return workCenter.find(x=>x.id==this.idWorkCenter)!.servicesTypes;    
  }
}
