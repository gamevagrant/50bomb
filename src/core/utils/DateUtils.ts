/**
 * Date工具类
 */
class DateUtils extends BaseClass{
    public constructor(){
        super();
    }

    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00   4:xx天，xx小时，xx分钟   5:xx天，xx小时，xx分钟,xx秒
     * @return
     *
     */
    public getFormatBySecond(second:number, type:number = 1):string{
        var str:string = "";
        switch(type){
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            // case 4:
            //     str = this.getFormatBySecond4(second);
            //     break;
            // case 5:
            //     str = this.getFormatBySecond5(second);
            //     break;
            // case 6:
            //     str = this.getFormatBySecond6(second);
            //     break;
            case 7:
                str = this.getFormatBySecond7(second);
                break;
        }
        return str;
    }

    //1: 00:00:00
    private getFormatBySecond1(num:number = 0):string{
        var hour:number = Math.floor(num / 3600);
        num %= 3600;
        var minute:number = Math.floor(num/60);
        var second:number = num % 60;
        return (hour >= 10 ? hour : "0"+hour) + ":" +
            (minute >= 10 ? minute : "0"+minute) + ":" + (second >= 10 ? second : "0" + second);
    }

    //3: 00:00
    private getFormatBySecond3(t:number = 0):string{
        t %= 3600;
        var m = Math.floor(t / 60);
        var s = t % 60;
        return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    }

    //2:yyyy-mm-dd h:m:s
    private getFormatBySecond2(time:number):string{
        var date:Date = new Date(time);
        var year:number = date.getFullYear();
        var month:number = date.getMonth() + 1; 	//返回的月份从0-11；
        var day:number = date.getDate();
        var hours:number = date.getHours();
        var minute:number = date.getMinutes();
        var second:number = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;

    }

    // //4:xx天，xx小时，xx分钟
    // private getFormatBySecond4(time:number):string {
    //     // var t = Math.floor(time / 3600);
    //     // if (t > 0) {
    //     //     if (t > 24) {
    //     //         return Math.floor(t / 24) + LangueManager.langueConfig[842];
    //     //     }
    //     //     else {
    //     //         return t + LangueManager.langueConfig[843];
    //     //     }
    //     // }
    //     // else {
    //     //     return Math.floor(time / 60) + LangueManager.langueConfig[844];
    //     // }
    // }

    // //5:xx天，xx小时，xx分钟,xx秒
    // private getFormatBySecond5(t:number):string {
    //     var result:string = "";
    //     var day:number = Math.floor(t/3600/24);
    //     t = t - day * 3600 * 24;
    //     var hour:number = Math.floor(t/3600);
    //     t = t - hour * 3600;
    //     var min:number = Math.floor(t/60);
    //     var sec:number = t%60;

    //     if(day != 0)
    //     {
    //         result = result + day + LangueManager.langueConfig[842];
    //     }
    //     if(hour != 0)
    //     {
    //         result = result + hour + LangueManager.langueConfig[845];
    //     }
    //     if(min != 0)
    //     {
    //         result = result + min + LangueManager.langueConfig[846];
    //     }
    //     if(sec != 0)
    //     {
    //         result = result + sec + LangueManager.langueConfig[847];
    //     }

    //     return result;
    // }

    // /**
    //  * 格式为 活动限时的时间 7天 12:00:00
    //  * @param time
    //  * @returns {string}
    //  */
    // public formatActivityTime(time:number):string
    // {
    //     var day = Math.floor(time / 86400);
    //     var s = time%86400;
    //     var str = "";
    //     if(day>0)
    //     {
    //         str = ""+day+LangueManager.langueConfig[842]+"  "
    //     }
    //     str+=DateUtils.getInstance().getFormatBySecond(s);
    //     return str;
    // }

    // //6:2014年10月27日
    // private getFormatBySecond6(time:number):string{
    //     var date:Date = new Date(time);
    //     var year:number = date.getFullYear();
    //     var month:number = date.getMonth() + 1; 	//返回的月份从0-11；
    //     var day:number = date.getDate();
    //     return year + LangueManager.langueConfig[848] + month + LangueManager.langueConfig[849] + day + LangueManager.langueConfig[850];

    // }
    //7:9:11:33
    private getFormatBySecond7(time:number):string{
        var date:Date = new Date(time);
        var hours:number = date.getHours();
        var minute:number = date.getMinutes();
        var second:number = date.getSeconds();
        return hours + ":" + minute + ":" + second;

    }

    public getLocalTime(nS) {     
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
     };
}