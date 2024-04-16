import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-votaciones',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules
    ],
    templateUrl:'votaciones.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotacionesComponent {
    poderDantes = ["Mayerlin Yandar", "John Chicaiza", "Mireya Rosero"]
 }
