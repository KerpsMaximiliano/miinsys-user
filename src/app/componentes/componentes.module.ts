import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JustificarRespuestaFotoComponent } from './justificar-respuesta-foto/justificar-respuesta-foto.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './footer/footer.component';
import { LeaveConfirmationDialog } from './leave-confirmation-dialog/leave-confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreguntaFirmaComponent } from './pregunta-firma/pregunta-firma.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '../auth/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    JustificarRespuestaFotoComponent,
    FooterComponent,
    LeaveConfirmationDialog,
    PreguntaFirmaComponent
  ],
  imports: [
    PipesModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports:[JustificarRespuestaFotoComponent, FooterComponent]
})
export class ComponentesModule { }
