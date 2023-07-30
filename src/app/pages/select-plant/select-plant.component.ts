import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PlantasService } from "src/app/services/plantas.service";

@Component({
    selector: 'app-select-plant',
    templateUrl: './select-plant.component.html',
    styleUrls: ['./select-plant.component.scss']
})

export class SelectPlantComponent implements OnInit {

    component: string = "SelectPlant";
    servicesTypeID : number = 0;
    workCenterID : number = 0;
    companyID : number = 0;
    plantID: number = 0;
    returnUrl: string='';

    menuTree: any;
    plantas = [] as Array<any>;
    nombreEmpresa: string = '';
    nombrePlanta: string = '';

    plantasCuestionarios = [] as Array<any>;
    
    constructor(
        private rutaActiva: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private plantasService: PlantasService
    ) {}

    ngOnInit(): void {
        this.returnUrl = "dashboard/selectBusiness";
        this.menuTree = JSON.parse(sessionStorage.getItem('arbol')!).empresasDto;
        this.companyID = this.rutaActiva.snapshot.params['empresaId'];
        this.nombreEmpresa = this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']).emp_descripcion;
        console.log(this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']));
        console.log(this.menuTree);
        this.menuTree[0].centroTrabajo.forEach((centro: { cuestionario: { id_planta: any; }; }) => {
            if(!this.plantasCuestionarios.includes(centro.cuestionario.id_planta)) {
                this.plantasCuestionarios.push(centro.cuestionario.id_planta)
            }
        });
        this.plantasService.getPlantas(this.companyID).subscribe(d => {
            console.log(d);
            if(d.length == 0) {
                this.router.navigate(['dashboard/selectGroup/' + this.rutaActiva.snapshot.params['empresaId'] + '/' + 0]);
            };
            this.plantasCuestionarios.forEach(plantaId => {
                let find = d.find((pl: { id_planta: any; }) => pl.id_planta == plantaId);
                if(find != undefined) {
                    if(!this.plantas.includes(find)) {
                        this.plantas.push(find)
                    }
                }
            });
            this.plantas = this.plantas.filter((pl: { id_estado: number; }) => pl.id_estado == 1);
        })
    }

    accessPlanta(planta: number) {
        this.router.navigate(['dashboard/selectGroup/' + this.rutaActiva.snapshot.params['empresaId'] + '/' + planta]);
    }
}