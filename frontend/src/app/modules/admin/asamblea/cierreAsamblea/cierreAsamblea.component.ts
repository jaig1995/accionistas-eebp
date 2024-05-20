import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-cierre-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        FuseLoadingBarComponent,
        ReactiveFormsModule,
        ButtonCargarDocumentosComponent
    ],
    templateUrl:'cierreAsamblea.component.html',
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CierreAsambleaComponent {
    //inyeccion de dependencias
    private fb = inject(FormBuilder)

    formulario = this.fb.group({
        numAccMercado: ['', [Validators.required,this.numberValidator ]],
        numAccUtilidades: ['', [Validators.required,this.numberValidator  ]],
        participacionAccion: ['', [Validators.required, this.numberValidator ]],
        pagoUtilidad: ['', Validators.required],
        valNomAccion: ['', [Validators.required,this.numberValidator  ]],
        valIntrinseco: ['', [Validators.required,this.numberValidator  ]],
        divParticipacion: ['', [Validators.required,this.numberValidator  ]],
    })

    numberValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
          return null; // Don't validate empty values to allow required validator to catch it
        }
        return isNaN(value) ? { notANumber: true } : null;
      }

      enviarFormularioParametrizacion(){
        console.log(this.formulario.value)
      }
}
