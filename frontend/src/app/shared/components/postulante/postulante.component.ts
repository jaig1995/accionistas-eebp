import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { InputAutocompleteComponent } from '../inputAutocomplete/inputAutocomplete.component';
import { SharedComponentsService } from '../sharedComponents.service';
import { Accionista } from '../interfaces/accionista.interface';

@Component({
    selector: 'app-postulante',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputAutocompleteComponent,
        AngularMaterialModules,
    ],
    templateUrl: 'postulante.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostulanteComponent {

    private sharedComponentsService = inject(SharedComponentsService)

    datosAccionista: any
    checked = false;
    indeterminate = false;
    informacionAccionista$: Observable<Accionista>;
    mostrarBoton = false;
    botonClick = false;

    obtenerDatosAccionista(valor: string) {
        this.datosAccionista = valor;
    }


    buscarAccionista() {
        const {idPer:codigoDelAccionista} = this.datosAccionista
        if(!codigoDelAccionista ) console.log("first")
        this.informacionAccionista$ = this.sharedComponentsService.obtenerInformacionAccionista(codigoDelAccionista);
    }

}



