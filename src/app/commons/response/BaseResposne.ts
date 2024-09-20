export class BaseResponse<T>{
    code!:number;
    duation!: number;
    message!: string;
    msgError!: string;
    path!: string;
    timestamp!: string;
    uuid! :string;
    data!: T;
}