import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-cierre-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules
    ],
    templateUrl:'cierreAsamblea.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CierreAsambleaComponent { }
