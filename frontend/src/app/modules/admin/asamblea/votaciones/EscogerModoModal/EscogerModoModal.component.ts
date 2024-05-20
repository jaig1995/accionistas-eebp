import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-escoger-modo-modal',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
    ],
    template: `<p>EscogerModoModal works!</p>`,
    templateUrl: 'EscogerModoModal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscogerModoModalComponent {

    private _router = inject(Router)

    constructor(
        public dialogRef: MatDialogRef<EscogerModoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        dialogRef.disableClose = true;
    }




    opcionBloque() {
        this.dialogRef.close(true)

    }

    opcionIndividual() {
        this.dialogRef.close(false)
    }

    cerraModal() {
        this.dialogRef.close(null)
        this._router.navigate(['/']);

    }
}
