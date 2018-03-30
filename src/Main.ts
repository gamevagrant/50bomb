//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
/*
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
*/
        egret.log("onAddToStage");
        egret.log("onAddToStage2");

        this.initializeAsync();
        //egret.startTick(this.moveStar,this);

        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //初始化Resource资源加载库
        RES.setMaxLoadingThread(8);
        //初始化Resource资源加载库
        App.ResourceUtils.addConfig("resource/default.res.json", "resource/");
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
        GameUtils.setGameSearch(window.location.search);
        this.initRgDot();
        this.adaptiveHandler();

            

    }

/*
    private time:number = 0;
	private moveStar(timeStamp:number):boolean {
		this.time++;
        
		if(this.time<=100)
		{
			egret.log("moveStar: ",this.time);
			egretfb.EgretFBInstant.setLoadingProgress(this.time);
		}else{
			egret.stopTick(this.moveStar,this);
			egret.log("stopTick: ",this.time);


		}

        return false;
    }
*/

   private initializeAsync(): void {
        egretfb.EgretFBInstant.initializeAsync().then(function () {
            egret.log("getLocale:", egretfb.EgretFBInstant.getLocale());
            egret.log("getPlatform:", egretfb.EgretFBInstant.getPlatform());
            egret.log("getSDKVersion", egretfb.EgretFBInstant.getSDKVersion());
            egret.log("getSupportedAPIs", egretfb.EgretFBInstant.getSupportedAPIs());
            egret.log("getEntryPointData", egretfb.EgretFBInstant.getEntryPointData());
        })
        setTimeout(function () {
            egret.log("超时");
            egretfb.EgretFBInstant.setLoadingProgress(100);
        }, 1000);

       
        egret.log("initializeAsync complate");
    }

     private initRgDot(){
        let app_id,user_uid,bn_version,td_channelid,local_uuid,is_sign_in,game_id;
        bn_version = '1.0.0.1';
        app_id = "AD365DA08ED94D1B89207BCF288A2DF5";
        user_uid = UrlUtils.getQueryString("user_uid");
        td_channelid = UrlUtils.getQueryString("td_channelid");
        local_uuid = encodeURIComponent(UrlUtils.getCookie('uuid'));
        is_sign_in = UrlUtils.getQueryString("is_sign_in");
        game_id = UrlUtils.getQueryString("app_id");
        let data = {app_id,user_uid,bn_version,td_channelid,local_uuid,is_sign_in,game_id};
        RgDot.init(data);
        RgDot.onEvent("game",{"gameStart":"true"});
    }

    private onConfigComplete()
    {
        let completeFun = ()=>{
            var theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.startCreateScene, this);
            egretfb.EgretFBInstant.setLoadingProgress(100);
            

        };
        let progressFun = (cur,total)=>{
            egretfb.EgretFBInstant.setLoadingProgress(cur/total * 100);
        };

        // App.HTTP.initServer("http://s1.ns.qimi.com/jssdk/index.php");
        HttpManager.initServerPath();
        App.ResourceUtils.loadGroup("preload",completeFun,progressFun,this);
        egret.log("onConfigComplete complate");
    }

    private adaptiveHandler(){
        let scale = document.documentElement.clientWidth/document.documentElement.clientHeight;
        if(scale < 1.3){
             this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        }else{
             this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        GameContainer.getInstance().init(this);
        ErrorManager.getInstance().init();
        let startGame = function(){
            egret.log("startGame");
            this.setRgDot();
            this.sendImg();
            GameUtils.refreshShareInfo();
            App.ResourceUtils.loadGroup("gameMainRes",()=>{
                GameControl.getInstance().initGame();
                egretfb.EgretFBInstant.startGameAsync().then(() => 
                {
                    egret.log("startGameAsync");
                });
            },null,this);
        }.bind(this);

        ProxyManager.getUserInfo(()=>{
                ProxyManager.sendLoadMapData(()=>{
                    let mapInfo = ProxyManager.getCache(HttpConst.loadMapData)["Model"];
                    if(mapInfo && mapInfo.length > 0){
                        startGame();
                    }else{
                        ProxyManager.sendGameRefresh(()=>{
                            startGame();
                        },this);
                    }
                },this);
        },this); 

        egret.log("startCreateScene complate");
    }

    private sendImg(){
        let url = "http://59.110.239.146:8080/fetchImg?img=" + UrlUtils.getQueryString("user_img_url") + "&uId=" + UrlUtils.getQueryString("user_uid");
        egret.log(url);
        HttpManager.requestURL("get",url);
    }

    private setRgDot(){
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");
        let accountId = UrlUtils.getQueryString("user_uid");
        let accountName = is_sign_in == "false"?0:UrlUtils.getQueryString("user_name");
        let gender = UrlUtils.getQueryString("user_gender");
        RgDot.Account({accountId,accountName,gender});
    }
}