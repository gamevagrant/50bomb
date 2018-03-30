class HttpManager extends BaseClass{

    public static serverPath = "";

    public static initServerPath(){
        HttpManager.serverPath = "https://h5.dodgame.com.cn/bomb";
    }

    public static sendMsg(name,obj={}){
        let url = HttpManager.serverPath + "/" + name;
        let parses = "";
        let apptoken = UrlUtils.getQueryString("token");
        let user_id = UrlUtils.getQueryString("user_uid");
        obj["apptoken"] = apptoken;
        obj["user_id"] = user_id;
        for(let key in obj){
            parses += `${key}=${obj[key]}&`
        }
        parses = parses.slice(0,parses.length-1);
        return HttpManager.requestURL(egret.HttpMethod.POST,url,parses);
    }

    public static requestURL(method = "get", url,params="") {
        method = method == "get" ? egret.HttpMethod.GET : egret.HttpMethod.POST;
        return new Promise((resovel, reject) => {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, method);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(params);
            request.addEventListener(egret.Event.COMPLETE, (evt) => {
                let query = evt.currentTarget.response;
                try{
                    let info = JSON.parse(query);
                    let code = info["return_code"];
                    resovel(info);
                }catch(e){
                    resovel();
                }
                // if(!DEBUG){
                //      if(code != 0){
                //         reject(code);
                //         ControlManager.getInstance().applyFunc(GameErrorEvent.gameSendError,code);
                //     }else{
                //         resovel(info);
                //     }
                // }else{
                //      resovel(info);
                // }
                
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, (err) => {
               // reject(err);
            }, this);
        })
    }

    public static loadImg(url){
        return new Promise(function(resovel,reject){
            var loader:egret.ImageLoader = new egret.ImageLoader();
            loader.crossOrigin = "anonymous";
            //添加加载完成侦听
            loader.addEventListener(egret.Event.COMPLETE, (event)=>{
                var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
                //获取加载到的纹理对象
                var bitmapData:egret.BitmapData = loader.data;
                //创建纹理对象
                var texture = new egret.Texture();
                texture.bitmapData = bitmapData;
                resovel(texture);
            }, this);

            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, (err) => {
                reject(err);
            }, this);
            //开始加载
            loader.load(url);
        })
    }
}