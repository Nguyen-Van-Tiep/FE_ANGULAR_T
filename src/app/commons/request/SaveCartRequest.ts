export class SaveCartRequest {
    detailCartId: Number;
    detailProductId: number;
    quantity: number;
    constructor(){
        this.detailCartId = 0;
        this.detailProductId = 0;
        this.quantity = 0;
    }
}