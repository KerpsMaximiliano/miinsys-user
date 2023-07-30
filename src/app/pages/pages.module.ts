import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WorkCenterComponent } from './work-center/work-center.component';
import { CompanyUserComponent } from './company-user/company-user.component';
import { ServicesTypeComponent } from './services-type/services-type.component';
import { CriticTaskComponent } from './critic-task/critic-task.component';
import { ArchivoCuestionarioModalComponent, CuestionarioTemplateComponent } from './cuestionario-template/cuestionario-template.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app.routing';
import { ComponentesModule } from '../componentes/componentes.module';
import { CuestionarioSendComponent } from './cuestionario-send/cuestionario-send.component';
import { FormularioTemplateComponent } from '../formulario-template/formulario-template.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectableItemsComponent } from './selectable-items/selectable-items.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CuestionarioSimpleTemplateComponent } from './cuestionario-simple-template/cuestionario-simple-template.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectFormComponent } from './select-form/select-form.component';
import { AdminComponent } from './admin/admin.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchCuestionarioComponent } from './admin/search-cuestionario/search-cuestionario.component';
import { TipoPreguntaPipe, ValorPreguntaPipe, ViewCuestionarioComponent } from './admin/view-cuestionario/view-cuestionario.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectBusinessComponent } from './select-business/select-business.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { PlanificadoSignatureComponent } from './planificado-signature/planificado-signature.component';
import { PreviewCuestionarioComponent } from './preview-cuestionario/preview-cuestionario.component';
import { MatCardModule } from '@angular/material/card';
import { PipesModule } from '../auth/pipes/pipes.module';
import { SelectPlantComponent } from './select-plant/select-plant.component';


@NgModule({
  declarations: [
    DashboardComponent,
    WorkCenterComponent,
    CompanyUserComponent,
    ServicesTypeComponent,
    CriticTaskComponent,
    CuestionarioTemplateComponent,
    CuestionarioSendComponent,
    PreviewCuestionarioComponent,
    FormularioTemplateComponent,
    SelectableItemsComponent,
    CuestionarioSimpleTemplateComponent,
    SelectFormComponent,
    SelectBusinessComponent,
    SelectGroupComponent,
    SelectPlantComponent,
    AdminComponent,
    SearchCuestionarioComponent,
    ViewCuestionarioComponent,
    TipoPreguntaPipe,
    ValorPreguntaPipe,
    ArchivoCuestionarioModalComponent,
    PlanificadoSignatureComponent
    ],
  imports: [
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ComponentesModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  exports: [
    
  ],
  providers: [
    //{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class PagesModule { }
