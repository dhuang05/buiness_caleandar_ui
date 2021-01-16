export  class Util {
    public static isEmpty(text: string| undefined| any): boolean{
        return text == null || text == undefined || text.toString().trim().length === 0;
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


    public static handleError(error:any) : string  {
        let message: string | undefined;
        if(error.status >= 400 && error.status < 500 ){
          message = 'Required authorization to perform the request.';
        } else if(error.status >= 500 ) {
           message = 'Service not available.';
        } else {
            message = JSON.stringify("Unknow Error");
            console.log(error);
        }

        return message;
    }

    // submit control;
    private submitTime = new Date().getTime() / 1000;
    private submitWait = 4;
    public canSubmit(): boolean {
      if ((new Date().getTime() / 1000 - this.submitTime) > this.submitWait) {
        this.submitTime = new Date().getTime() / 1000;
        return true;
      } else {
        return false;
      }
    }
  
}