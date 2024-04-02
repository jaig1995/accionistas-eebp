import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-plancha-postulante',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules

    ],
    templateUrl:'planchaPostulante.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanchaPostulanteComponent {

    @Input() modoPlanchaUnPostulante: boolean;
    @Input() modoVotacion: boolean;
}
