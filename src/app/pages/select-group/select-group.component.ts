import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PlantasService } from "src/app/services/plantas.service";

@Component({
    selector: 'app-select-group',
    templateUrl: './select-group.component.html',
    styleUrls: ['./select-group.component.scss']
})

export class SelectGroupComponent implements OnInit {

    component: string = "SelectGroup";
    servicesTypeID : number = 0;
    workCenterID : number = 0;
    companyID : number = 0;
    groupID: number = 0;
    plantId: number = 0;
    returnUrl: string='';

    menuTree: any;
    grupos = [] as Array<any>;
    nombreEmpresa: string = '';
    nombrePlanta: string = '';
    
    constructor(
        private rutaActiva: ActivatedRoute,
        private router: Router,
        private plantasService: PlantasService
    ) {}

    ngOnInit(): void {
        this.companyID = this.rutaActiva.snapshot.params['empresaId'];
        this.plantId = this.rutaActiva.snapshot.params['plantaId'];
        this.returnUrl = "dashboard/selectPlant/" + this.companyID;
        this.menuTree = JSON.parse(sessionStorage.getItem('arbol')!).empresasDto;
        this.plantasService.getPlantas(this.companyID).subscribe(d => {
            if (d.length > 0) {
                this.nombrePlanta = d.find((pl: { id_planta: number; }) => pl.id_planta == this.plantId).descripcion
            }
        })
        if(this.plantId != 0) {
            this.menuTree[0].centroTrabajo = this.menuTree[0].centroTrabajo.filter((x: { cuestionario: { id_planta: number; }; }) => x.cuestionario.id_planta == this.plantId);
        };
        console.log(this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']))
        this.nombreEmpresa = this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']).emp_descripcion;
        console.log(this.menuTree);
        console.log(this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']));
        this.menuTree.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']).centroTrabajo.forEach((centro: { cuestionario: { grupo: { id_grupo: any; descripcion: any; orden: number}; }; }) => {
            let find = this.grupos.find(gr => gr.id == centro.cuestionario.grupo.id_grupo);
            if (find == undefined) {
                console.log(centro.cuestionario.grupo)
                this.grupos.push({
                    id: centro.cuestionario.grupo.id_grupo,
                    descripcion: (centro.cuestionario.grupo.descripcion == undefined) ? 'Otros' : centro.cuestionario.grupo.descripcion,
                    orden: (centro.cuestionario.grupo.descripcion == undefined) ? 999 : (centro.cuestionario.grupo.orden == undefined) ? 0 : centro.cuestionario.grupo.orden,
                });
            };
            this.grupos.sort((a, b) => {
                return (a.orden < b.orden) ? -1 : (a.orden > b.orden) ? 1 : 0;
            });
        });
        if(this.grupos.filter(g => g.id != 0).length == 0) {
            this.router.navigate(['dashboard/selectForm/' + this.rutaActiva.snapshot.params['empresaId'] + '/' + this.plantId + '/' + 0]);
        }
    }

    accessGrupo(grupo: number) {
        this.router.navigate(['dashboard/selectForm/' + this.rutaActiva.snapshot.params['empresaId'] + '/' + this.plantId + '/' + grupo]);
    }
}