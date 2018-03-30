/**
 * Created by Administrator on 2016/8/19.
 */
class ControlManager extends BaseClass
{
    //注册
    private dicArr = [];
    public on(key:string,completeFunc:Function,thisObj:any)
    {
        for(let dic of this.dicArr)
        {
            if(dic[key] && dic[key][0] == completeFunc && dic[key][1] == thisObj)
            {
                console.log("事件注册重复");
                return;
            }
        }
        let dic = {};
        dic[key] = [completeFunc,thisObj];
        this.dicArr.push(dic);
    }
    //触发
    public applyFunc(key:string,...parme:any[])
    {
        for(let dic of this.dicArr)
        {
            if(dic[key]){
                let arr = dic[key];
                arr[0].apply(arr[1],parme);
            }
        }
    }
    //移除
    public removeListener(key:string,completeFunc:Function,thisObj:any)
    {
        for (let dic of this.dicArr)
        {
            if(dic[key] && dic[key][0] == completeFunc && dic[key][1] == thisObj)
            {
                dic[key][0] = dic[key][1] = null;
                var index = this.dicArr.indexOf(dic);
                this.dicArr.splice(index,1);
            }
        }
    }
}