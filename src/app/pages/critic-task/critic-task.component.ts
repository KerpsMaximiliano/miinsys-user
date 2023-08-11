import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment, Router } from '@angular/router';
import { CriticTaskModel } from '../../interfaces/critc-task';
import { UserModel } from 'src/app/interfaces/user';
import { WorkCenterModel } from '../../interfaces/work-center';
import { CuestionarioService } from 'src/app/services/cuestionario.service';

// * Services.
import { GeolocationService } from 'src/app/core/services/geolocation.service';

@Component({
  selector: 'app-critic-task',
  templateUrl: './critic-task.component.html',
  styleUrls: ['./critic-task.component.scss'],
})
export class CriticTaskComponent implements OnInit {
  component: string = 'CriticTask';
  servicesTypeID: number = 0;
  workCenterID: number = 0;
  companyID: number = 0;
  returnUrl: string = '';

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private cuestionarioService: CuestionarioService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('formularioSimple');
    this.cuestionarioService.setLocation(0, 0);
    this.cuestionarioService.setAnswer(null);
    this.cuestionarioService.setSimpleAnswer(null);
    this.cuestionarioService.setFile(null);
    this.cuestionarioService.setPlanificadoFinalAnswer(null);
    this.rutaActiva.paramMap.subscribe((params: ParamMap) => {
      this.servicesTypeID = Number(params.get('servicesTypeID')!);
      this.workCenterID = Number(params.get('workCenterID')!);
      this.companyID = Number(params.get('companyID')!);
    });
    this.returnUrl =
      'dashboard/servicesTypes' +
      '/' +
      this.companyID +
      '/' +
      this.workCenterID;
  }
  getCriticTask(): CriticTaskModel[] {
    const estructuraCuestionarios: UserModel = JSON.parse(
      sessionStorage.getItem('estructuraCuestionarios')!
    );
    const workCenter: WorkCenterModel[] =
      estructuraCuestionarios.companyUser.find(
        (x) => x.id == this.companyID
      )!.workCenters;
    const serviceType = workCenter.find(
      (x) => x.id == this.workCenterID
    )!.servicesTypes;
    const criticTask = serviceType.find(
      (x) => x.id == this.servicesTypeID
    )!.criticTasks;
    return criticTask;
  }

  returnBack() {
    this.router.navigate([this.returnUrl]);
  }
  returnToHome() {
    this.router.navigate(['dashboard/companies']);
  }

  accessFormulario(criticTask: any) {
    this.geolocationService.set().subscribe((res: any) => {
      if (res.success) {
        this.cuestionarioService.setLocation(res.lat, res.lon);

        if (criticTask.id == 7) {
          this.router.navigate([
            `dashboard/cuestionarioSimple/${this.companyID}/${this.workCenterID}/${this.servicesTypeID}/${criticTask.id}`,
          ]);
        } else {
          this.router.navigate([
            `dashboard/cuestionario/${this.companyID}/${this.workCenterID}/${this.servicesTypeID}/${criticTask.id}`,
          ]);
        }
      }
    });

    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.cuestionarioService.setLocation(position.coords.latitude, position.coords.longitude);
    //   if(criticTask.id == 7) {
    //     this.router.navigate([`dashboard/cuestionarioSimple/${this.companyID}/${this.workCenterID}/${this.servicesTypeID}/${criticTask.id}`])
    //   } else {
    //     this.router.navigate([`dashboard/cuestionario/${this.companyID}/${this.workCenterID}/${this.servicesTypeID}/${criticTask.id}`])
    //   }
    // })
  }
}
