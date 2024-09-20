export class UserInfo {
    userId!: number;
    userName!: string;
    email!: string;
    phone!: string;
    fullAddress!: string;
    addressCode!: number;
    fullName!: string;
    constructor(){
        this.userId = 0;
        this.userName = '';
        this.email = '';
        this.phone = '';
        this.fullAddress = '';
        this.addressCode = 0;
        this.fullName = '';
    }
}