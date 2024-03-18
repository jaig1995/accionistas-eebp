export interface Accionista {
    codUsuario:             string;
    tipDocumento:           string;
    nomPri:                 string;
    nomSeg:                 string;
    apePri:                 string;
    apeSeg:                 string;
    tipoPersona:            string;
    razonSocial:            null;
    departamentoExp:        string;
    municipioExp:           string;
    fecNacimiento:          Date;
    genPersona:             string;
    depNacimiento:          string;
    lugNacimiento:          string;
    estCivPersona:          string;
    celPersona:             string;
    profPersona:            string;
    actEcoPersona:          string;
    correoPersona:          string;
    tipoDireccionDomicilio: string;
    dirDomicilio:           string;
    departamentoDomicilio:  string;
    municipioDomicilio:     string;
    paisDomicilio:          string;
    telfDomicilio:          string;
    indTelDomicilio:        string;
    nomEmpresa:             null;
    tipoDireccionLaboral:   null;
    dirLaboral:             null;
    municipioLaboral:       null;
    departamentoLaboral:    null;
    paisLaboral:            null;
    telfLaboral:            null;
    extLaboral:             null;
    dirCorrespondencia:     null;
    otraDirLaboral:         string;
    opcPotestad:            null;
    huella:                 string;
    huella2:                string;
    firma:                  string;
    tipoVivienda:           string;
    numPersonas:            number;
    autorizaCorreo:         null;
    autorizaLlamada:        null;
    autorizaTodas:          null;
    autorizaMensaje:        null;
    autorizaFisico:         null;
    recursos:               string;
    ingresos:               string;
    numSuscripcion:         string;
    barrioLaboral:          null;
    barrioDomicilio:        string;
    numCuentaBancaria:      number;
    tipoCuentaBancaria:     string;
    entidadBancaria:        string;
    esAccionista:           string;
    titulos:                Titulo[];
}

export interface Titulo {
    conseTitulo:  number;
    canAccTit:    number;
    valAccTit:    number;
    claAccTit:    string;
    tipAccTit:    string;
    estTit:       string;
    fecCreTit:    Date;
    fecFinTit:    Date;
    obsAccTit:    string;
    estadoTitulo: EstadoTitulo;
}

export interface EstadoTitulo {
    ideEstadoTitulo: number;
    descEstado:      string;
}
