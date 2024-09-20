export class CatalogResponse{
    id: number;
    name: string;
    code: string;
    parentId: number;
    constructor(id: number, name: string, parentId: number, code: string){
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.code = code;
    }
}