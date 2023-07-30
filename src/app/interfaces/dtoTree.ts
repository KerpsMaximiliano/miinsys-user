export interface ArbolDto {
    id: number,
    name: string,
    descripcion: string,
    nivel: string,
    orden: string,
    cuestionario_id: number,
    companyUser?: ArbolDto[],
    workCenters?: ArbolDto[],
    servicesTypes?: ArbolDto[],
    criticTasks?: ArbolDto[]
}