import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { LeaveConfirmationDialog } from '../leave-confirmation-dialog/leave-confirmation-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    @Input() register!: boolean;
    @Input() buttons!: boolean;
    @Input() back!: string;
    @Input() home!: string;
    @Input() modalBack!: boolean;
    @Input() modalHome!: boolean;
    

    expandedMenu: boolean = false;
    menuIcon: string = 'menu';

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private cuestionarioService: CuestionarioService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openMenu() {
    if(this.expandedMenu) {
        this.menuIcon = 'menu';
    } else {
        this.menuIcon = 'close';
    }
    this.expandedMenu = !this.expandedMenu;

    setTimeout(() => {
      this.menuIcon = 'menu';
      this.expandedMenu = false;
    }, 5000);
  }

  logout() {
    this.usuariosService.logout();
    this.cuestionarioService.cleanAll();
    this.router.navigate(['/'])
  }

  return() {
    if(!this.modalBack) {
      if(this.back.includes('selectForm')) {
        this.cuestionarioService.setLocation(0, 0);
        this.cuestionarioService.setAnswer(null);
        this.cuestionarioService.setSimpleAnswer(null);
        this.cuestionarioService.setFile(null);
        this.cuestionarioService.setPlanificadoFinalAnswer(null);
        this.cuestionarioService.setFirmaDatosAdicionales(null);
      }
      this.router.navigate([this.back]);
    } else {
      const dialogRef = this.dialog.open(LeaveConfirmationDialog, {
        width: '85%',
        height: '40%'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.status) {
            this.cuestionarioService.setLocation(0, 0);
            this.cuestionarioService.setAnswer(null);
            this.cuestionarioService.setSimpleAnswer(null);
            this.cuestionarioService.setFile(null);
            this.cuestionarioService.setPlanificadoFinalAnswer(null);
            this.cuestionarioService.setFirmaDatosAdicionales(null);
            this.router.navigate([this.back]);
          } else {
            return;
          }
        }
      });
    }
  }

  goHome() {
    if(!this.modalHome) {
      this.cuestionarioService.cleanAll();
      //this.router.navigate(['/dashboard/companies']);
      this.router.navigate(['/dashboard/selectBusiness']);
    } else {
      const dialogRef = this.dialog.open(LeaveConfirmationDialog, {
        width: '85%',
        height: '40%'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.status) {
            this.cuestionarioService.setLocation(0, 0);
            this.cuestionarioService.setAnswer(null);
            this.cuestionarioService.setSimpleAnswer(null);
            this.cuestionarioService.setFile(null);
            this.cuestionarioService.setPlanificadoFinalAnswer(null);
            //this.router.navigate(['/dashboard/companies']);
            this.router.navigate(['/dashboard/selectBusiness']);
          } else {
            return;
          }
        }
      });
    }
  }

}