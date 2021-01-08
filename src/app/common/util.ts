export  class Util {
    public static isEmpty(text: string| undefined): boolean{
        return text == null || text == undefined || text.toString().trim().length == 0;
    }

    public static isEqual(a:any, b: any): boolean{
        if(Util.isEmpty(a) && Util.isEmpty(b)){
            return true;
        } else if ((!Util.isEmpty(a) && Util.isEmpty(b)) || (Util.isEmpty(a) && !Util.isEmpty(b))){
            return false;
        } else {
            return (JSON.stringify(a) ==  JSON.stringify(b));
        }
    }
   
    public static copy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

}