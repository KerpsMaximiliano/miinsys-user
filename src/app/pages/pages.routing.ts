import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WorkCenterComponent } from './work-center/work-center.component';
import { CompanyUserComponent } from './company-user/company-user.component';
import { CuestionarioTemplateComponent } from './cuestionario-template/cuestionario-template.component';
import { ServicesTypeComponent } from './services-type/services-type.component';
import { CriticTaskComponent } from './critic-task/critic-task.component';
import { CuestionarioSendComponent } from './cuestionario-send/cuestionario-send.component';
import { FormularioTemplateComponent } from '../formulario-template/formulario-template.component';
import { JustificarRespuestaFotoComponent } from '../componentes/justificar-respuesta-foto/justificar-respuesta-foto.component';
import { SelectableItemsComponent } from './selectable-items/selectable-items.component';
import { CuestionarioSimpleTemplateComponent } from './cuestionario-simple-template/cuestionario-simple-template.component';
import { SelectFormComponent } from './select-form/select-form.component';
import { AdminComponent } from './admin/admin.component';
import { SearchCuestionarioComponent } from './admin/search-cuestionario/search-cuestionario.component';
import { ViewCuestionarioComponent } from './admin/view-cuestionario/view-cuestionario.component';
import { SelectBusinessComponent } from './select-business/select-business.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { PlanificadoSignatureComponent } from './planificado-signature/planificado-signature.component';
import { PreguntaFirmaComponent } from '../componentes/pregunta-firma/pregunta-firma.component';
import { PreviewCuestionarioComponent } from './preview-cuestionario/preview-cuestionario.component';
import { SelectPlantComponent } from './select-plant/select-plant.component';



const routes: Routes = [
    { 
        path: 'dashboard',
        component: SelectableItemsComponent,
        //canActivate: [AuthGuard],
        children: [
            { path: 'formulario', component: FormularioTemplateComponent, data: { titulo: 'ProgressBas' } },
            { path: 'workCenters/:companyID', component: WorkCenterComponent, data: { titulo: 'ProgressBas', animationState: 'Two' } },
            { path: 'companies', component: CompanyUserComponent, data: { titulo: 'ProgressBas', animationState: 'One' } },
            { path: 'servicesTypes/:companyID/:id', component: ServicesTypeComponent, data: { titulo: 'ProgressBas', animationState: 'Three' } },
            { path: 'criticTask/:companyID/:workCenterID/:servicesTypeID', component: CriticTaskComponent, data: { titulo: 'ProgressBas', animationState: 'Four' } },
            { path: 'cuestionario/:companyID/:plantaId/:groupId/:cuestionarioID', component: CuestionarioTemplateComponent, data: { titulo: 'ProgressBas', animationState: 'Five' } },
            { path: 'cuestionario/:companyID/:workCenterID/:servicesTypeID/:cuestionarioID/planificado', component: PlanificadoSignatureComponent, data: { titulo: 'ProgressBas', animationState: 'Six' } },
            { path: 'cuestionarioSimple/:companyID/:workCenterID/:servicesTypeID/:cuestionarioID', component: CuestionarioSimpleTemplateComponent, data: { titulo: 'ProgressBas', animationState: 'Five' } },
            { path: 'cuestionarioSend', component: CuestionarioSendComponent, data: { titulo: 'ProgressBas', animationState: 'Seven' } },
            { path: 'previewCuestionario', component: PreviewCuestionarioComponent, data: { titulo: 'ProgressBas', animationState: 'Seven' } },
            { path: 'justifyAnswer', component: JustificarRespuestaFotoComponent, data: { titulo: 'ProgressBas', animationState: 'Six' } },
            { path: 'preguntaFirma', component: PreguntaFirmaComponent, data: { titulo: 'ProgressBas', animationState: 'Six' } },
            { path: 'selectBusiness', component: SelectBusinessComponent, data: { titulo: 'ProgressBas', animationState: 'One' } },
            { path: 'selectPlant/:empresaId', component: SelectPlantComponent, data: { titulo: 'ProgressBas', animationState: 'Two' } },
            { path: 'selectForm/:empresaId/:plantaId/:groupId', component: SelectFormComponent, data: { titulo: 'ProgressBas', animationState: 'Four' } },
            { path: 'selectGroup/:empresaId/:plantaId', component: SelectGroupComponent, data: { titulo: 'ProgressBas', animationState: 'Three' } },
        ]
    },
    { 
        path: 'cuestionarios',
        component: AdminComponent,
        //canActivate: [AuthGuard],
        children: [
            { path: '', component: SearchCuestionarioComponent, data: { titulo: 'ProgressBas', animationState: 'One' } },
            { path: ':id', component: ViewCuestionarioComponent, data: { titulo: 'ProgressBas', animationState: 'Two' } },
            
        ]
    },

];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
    //providers: [AuthGuard]
})
export class PagesRoutingModule {}


