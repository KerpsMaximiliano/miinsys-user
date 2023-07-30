import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/interfaces/user';
import { WorkCenterModel } from '../../interfaces/work-center';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-work-center',
  templateUrl: './work-center.component.html',
  styleUrls: ['./work-center.component.css']
})
export class WorkCenterComponent implements OnInit {
  component: string = "WorkCenter"
  idCompany : number = 0;
  returnUrl: string='';

  constructor(private rutaActiva: ActivatedRoute, private router :Router) { }
  
  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe(
      (params: ParamMap) => {
        this.idCompany = Number(params.get('companyID')!);
      }
    );
    this.returnUrl = "dashboard/companies";
    
  }
  getWorkCenters() : WorkCenterModel[]
  {
    const estructuraCuestionarios : UserModel = JSON.parse(sessionStorage.getItem('estructuraCuestionarios')!);
    console.log(estructuraCuestionarios)
    return estructuraCuestionarios.companyUser.find(x=>x.id==this.idCompany)!.workCenters;    
  }
  returnBack()
  {
    this.router.navigate([this.returnUrl]);  
  }
  returnToHome()
  {
    this.router.navigate(['dashboard/companies']);  
  }
}
