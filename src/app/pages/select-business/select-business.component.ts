import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";


@Component({
    selector: 'app-select-business',
    templateUrl: './select-business.component.html',
    styleUrls: ['./select-business.component.scss']
})

export class SelectBusinessComponent implements OnInit {

    component: string = "SelectBusiness";
    servicesTypeID : number = 0;
    workCenterID : number = 0;
    companyID : number = 0;
    returnUrl: string='';
    empresas = [] as Array<any>;
    menuTree: any;

    constructor(
        private router: Router
    ) {}

    ngOnInit(): void {
        this.menuTree = JSON.parse(sessionStorage.getItem('arbol')!).empresasDto;
        console.log(this.menuTree)
        this.menuTree.forEach((emp: { emp_id: any; emp_descripcion: any; }) => {
            this.empresas.push({
                id: emp.emp_id,
                descripcion: emp.emp_descripcion
            });
        });
        console.log(this.empresas)
        if(this.menuTree.length == 1) {
            this.router.navigate(['dashboard/selectPlant/' + this.empresas[0].id]);
        }
    }

    accessEmpresa(empresa: number) {
        this.router.navigate(['dashboard/selectPlant/' + empresa]);
    }
}