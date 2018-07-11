export class ProductType{
    id:number;
    companyId:string;
    code:string;
    name:string;
    //a variable used by the application to know whether display products in category
    //doesn't exist in the database
    show:boolean = false;
}