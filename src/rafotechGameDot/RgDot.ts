/**
 * talking第三方打点
 * http://doc.talkingdata.com/posts/70
 * 需要扩展时 请查看文档
 */

class RgDot{

    private static dotUrl:string = "";
    private static loadIsComplete:boolean = false;
    private static gameInfo;
    // info : app_id,user_uid,bn_version,td_channelid,local_uuid,is_sign_in;
    public static init(info){
        RgDot.gameInfo = info;
        this.checkoutParameter();
    }

   

    /**
     * 注册、登录、切换帐户、唤醒游戏时传入玩家账户信息
     * accountId,level,gameServer,accountType,age,accountName,gender
     * @param param0 accountId 玩家唯一id gender 性别：1男 2女 
     * accountName 0 匿名用户名 
     * accountType  账户类型 系统预留了10种自定义的帐户类型，分别为：AccountType.TYPE1到AccountType.TYPE10
     * 
     */
    public static Account(data){
        if(this.TDGA){
            this.TDGA.Account({
                accountId : data.accountId,
                level : data.level || 1,
                gameServer : data.gameServer || "",
                accountType : data.accountType || 1,
                age : data.age || 0,
                accountName : data.accountName || "",
                gender : data.gender || 1
                });
        }
    }

    /**
     * 追踪获赠的虚拟币（可选）
     * @param virtualCurrencyAmount  虚拟币金额。
     * @param reason 赠送虚拟币原因/类型 格式：32 个字符内的中文、空格、英文、数字。不要带有任何开发中的转义字符，如斜杠。注意：最多支持 100 种不同原因。
     */
    public static onReward(virtualCurrencyAmount,reason){
        if(this.TDGA){
            this.TDGA.onReward(virtualCurrencyAmount, reason)
        }
    }

    /**
     * 消耗虚拟币时 统计 （虚拟币为充值获得）
     * @param item  某个消费点的编号，最多 32 个字符。
     * @param itemNumber  消费数量
     * @param priceInVirtualCurrency  虚拟币单价
     */
    public static onPurchase(item,itemNumber,priceInVirtualCurrency){
        if(this.TDGA){
            this.TDGA.onItemPurchase(item, itemNumber, priceInVirtualCurrency);
        }
    }

    /**
     * 某个道具/服务被用掉（消失）时
     */
    public static onUse(item,itemNumber){
        if(this.TDGA){
            this.TDGA.onItemUse(item, itemNumber);
        }
    }

   /**
    * 发送自定义打点事件
    * @param eventId 事件id 
    * @param info  key-value 例如：'reason':"PK致死"
    */
    public static onEvent (event,info){
        if(this.TDGA){
            this.TDGA.onEvent(event, info);
        }
        let typeKey;
        let infoValue;
        for(let key in info){
            typeKey = key;
            infoValue = info[key];
        }
        RgDot.sendData({"type":typeKey,"event":event,"info":{[typeKey]:infoValue}});
    }

    /**
     * 离开游戏
     */
    public static onPageLeave(){
        if(this.TDGA){
            this.TDGA.onPageLeave();
        }
    }

    private static checkoutParameter(){
        let td_channelid = this.getQueryString("td_channelid");
        if(!td_channelid || td_channelid.length <= 0){
            console.log("请在url上添加td_channelid字段 用于打点-渠道统计");
        }
    }

    private static onDotUrlError(){
        RgDot.loadIsComplete = false;
        console.log("打点js加载失败");
    }
    
    private static onDotUrlComplete(){
        RgDot.loadIsComplete = true;
    }

    private static loadSingleScript(src,callback,errorback){
        var s = document.createElement('script');
            s.async = true;
            s.src = src;
            s.addEventListener('load', function () {
                s.parentNode.removeChild(s);
                callback();
            }, false);

            s.addEventListener('error',function(){
                errorback();
            })
            if(document.body){
                document.body.appendChild(s);
            }
    }

    private static sendData(data){
        this.doGet(this.getFullUrl(data));
    }


    private static getFullUrl({type,event,info}){

        var full_URL = `//211.159.161.28/?event=${event}&type=${type}&game_id=${this.gameInfo.game_id || ""}&user_id=${this.gameInfo.user_uid || ""}&bn_version=${this.gameInfo.bn_version || ""}&td_channelid=${this.gameInfo.td_channelid || ""}&uuid=${this.gameInfo.local_uuid || ""}&is_sign_user=${this.gameInfo.is_sign_in || ""}&timestamp=${new Date().valueOf()}`;

                    for (var key in info) {
                        full_URL += '&' + key + '=' + info[key];
                      }
        return full_URL;
    }

    private static doGet(url,onSuccess=null){
        var loader:egret.URLLoader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function () {
            var data = {
                "response": loader.data
            };
            onSuccess && onSuccess(data)
        }, this);
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            console.error("404:" + url);
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.GET;
        loader.load(request);
    }
    

    private static getQueryString(name) : string {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window
            .location
            .search
            .substr(1)
            .match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    public static get TDGA(){
        if(window["TDGA"]){
            return window["TDGA"];
        }else{
            console.log("打点加载失败");
        }
    }
}