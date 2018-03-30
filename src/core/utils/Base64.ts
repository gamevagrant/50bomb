class Base64 extends BaseClass
{
    public doEncode(value){
        return window["btoa"](value);
    }

    public doDecode(value:string){
        return window["atob"](value);
    }
}