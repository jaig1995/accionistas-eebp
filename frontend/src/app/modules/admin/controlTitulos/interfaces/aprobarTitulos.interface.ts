export interface AprobarTitulos {
    conseTrans:        number;
    fecTrans:          Date;
    idePer:            string;
    valTran:           number;
    intencionCompra:   boolean;
    tipoTransaccion:   TipoTransaccion;
    estadoTransaccion: any;
    transaccionTitulo: any[];
    files:             File[];
}

export interface File {
    fileName: string;
    url:      string;
}

export interface TipoTransaccion {
    codTipTran: number;
    desTran:    string;
}
