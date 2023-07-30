import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { PlantasService } from 'src/app/services/plantas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.scss']
})
export class SelectFormComponent implements OnInit {
  component: string = "SelectForm";
  servicesTypeID : number = 0;
  workCenterID : number = 0;
  companyID : number = 0;
  returnUrl: string='';
  formularios = [
    // {name: "Reporte de Mantencion preventiva FIT 2000", id: 4},
    // {name: "Checklist vehiculo de servicio (camionetas) R-064.DRT Sistema de gestión integrado", id: 5},
  ] as Array<{id: number, name: string, orden: number}>;
  nombreEmpresa!: string;
  nombrePlanta: string = '';
  nombreGrupo: string = '';
  menuTree: any;
  groupId: number = 0;
  plantId: number = 0;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private cuestionarioService: CuestionarioService,
    private ususarioService: UsuariosService,
    private dialog: MatDialog,
    private plantasService: PlantasService
    ) { }

  ngOnInit(): void {
    this.menuTree = JSON.parse(sessionStorage.getItem('arbol')!);
    console.log(this.menuTree.empresasDto)
    console.log(this.menuTree.empresasDto.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']))
    this.companyID = this.rutaActiva.snapshot.params['empresaId'];
    this.groupId = this.rutaActiva.snapshot.params['groupId'];
    this.plantId = this.rutaActiva.snapshot.params['plantaId'];
    this.plantasService.getPlantas(this.companyID).subscribe(d => {
      if (d.length > 0) {
        this.nombrePlanta = d.find((pl: { id_planta: number; }) => pl.id_planta == this.plantId).descripcion
      }
  })
    if(this.menuTree.empresasDto.length > 1) {
      this.returnUrl = "dashboard/selectGroup/" + this.rutaActiva.snapshot.params['empresaId'];
    };
    this.nombreEmpresa = this.menuTree.empresasDto.find((e: { emp_id: number; }) => e.emp_id == this.rutaActiva.snapshot.params['empresaId']).emp_descripcion;
    if(this.plantId != 0) {
      this.menuTree.empresasDto[0].centroTrabajo = this.menuTree.empresasDto[0].centroTrabajo.filter((x: { cuestionario: { id_planta: number; }; }) => x.cuestionario.id_planta == this.plantId);
    }
    console.log(this.nombreGrupo);
    if(this.menuTree.empresasDto.length == 0 ) {

    } else {
      this.menuTree.empresasDto.forEach((emp: { emp_id: any; centroTrabajo: any[]; }) => {
        if(emp.emp_id == this.companyID) {
          emp.centroTrabajo.forEach(cue => {
            if(cue.cuestionario.grupo.id_grupo == this.groupId) {
              this.nombreGrupo = cue.cuestionario.grupo.descripcion;
              this.formularios.push({
                name: cue.titulo,
                id: cue.cuestionario.id_cuestionario,
                orden: cue.orden
              })
            }
          });
        }
      });
      this.formularios.sort((a, b) => a.orden - b.orden);
      console.log(this.formularios)
    }
    localStorage.removeItem('formularioSimple');
    this.cuestionarioService.setLocation(0, 0);
    this.cuestionarioService.setAnswer(null);
    this.cuestionarioService.setSimpleAnswer(null);
    this.cuestionarioService.setAnswerBack(null);
    this.cuestionarioService.setFile(null);
    this.cuestionarioService.setPlanificadoFinalAnswer(null);
  }

  returnToHome()
  {
    this.router.navigate(['dashboard/companies']);
  }

  accessFormulario(formulario: any) {
    navigator.geolocation.getCurrentPosition((position) => {
      //console.log(position.coords);
      this.cuestionarioService.setLocation(position.coords.latitude, position.coords.longitude);
      console.log(position)
      this.router.navigate([`dashboard/cuestionario/${this.companyID}/${this.plantId}/${this.groupId}/${formulario.id}`])
    }
    ,err => {
      console.log("Error");
      this.dialog.open(LocationErrorModalComponent, {
        maxHeight: '85vh',
        height: 'auto'
      });
    })
  }
}

@Component({
  selector: 'cuestionario-modal',
  template: `<h1 mat-dialog-title>Permisos de ubicación bloqueados</h1>
  <div mat-dialog-content>
    <p>Para habilitarlo siga las instrucciones</p>
    <img src="../assets/images/location-guide/print 1 - trimmed.jpg" alt="" style="max-width: 65vw" class="mb-4">
    <img src="../assets/images/location-guide/print 2 - trimmed.jpg" alt="" style="max-width: 65vw" class="mb-4">
    <img src="../assets/images/location-guide/print 3 - trimmed.jpg" alt="" style="max-width: 65vw" class="mb-4">
  </div>
  <div mat-dialog-actions>
    <button mat-button class="main__input--send" (click)="dialogRef.close()">Cerrar</button>
  </div>`
})

export class LocationErrorModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LocationErrorModalComponent>,
  ) { }

  ngOnInit(): void {
    
  }

}
