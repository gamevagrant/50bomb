class GiftLayer extends BaseEuiBoxView{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/GiftLayerSkin.exml";
    }

    public attentionBtn:eui.Button;
    public getAwardBtn:eui.Button;
    public shareAwardBtn:eui.Button;
    public closeButton:eui.Button;
    public shareTimeLabel:eui.Label;
    
    private _shareAwardData:any;
    private _subscribeAwardData:any;
    private _attentionState:number;
    private _timeNum:number = -1;
    public initView(){

        App.DisplayUtils.registerBtn(this.attentionBtn,this.onAttentionHandler,this);
        App.DisplayUtils.registerBtn(this.getAwardBtn,this.onGetAwardHandler,this);
        App.DisplayUtils.registerBtn(this.shareAwardBtn,this.onShareAwardHandler,this);
        App.DisplayUtils.registerBtn(this.closeButton,this.onCloseHandler,this);

         App.TimerManager.doTimer(1000,0,this.onTimeHandler,this);
         ControlManager.getInstance().on(GameEvent.shareMessage,this.onMessageHandler,this);
         this.shareAwardBtn.enabled = true;
         this.shareTimeLabel.visible = false;
         this.shareTimeLabel.text = "";
    }

    private onTimeHandler(){
        if(this._timeNum > 0 && this._shareAwardData.Share < 2){
            this._timeNum--;
            if(this._timeNum <=0){
                this.shareTimeLabel.visible = false;
                this.shareTimeLabel.text = "";
                this.setShareBtnState();
            }else{
                this.shareTimeLabel.text = DateUtils.getInstance().getFormatBySecond(this._timeNum,1);
            }
        }
    }

    public openView(shareAwardData,subscribeAwardData){
        this._shareAwardData = shareAwardData;
        this._subscribeAwardData = subscribeAwardData;

        this.getAwardBtn.visible = false;
        this.attentionBtn.visible = false;
       
        this.setState();
        this.setTimeNum();
        this.setShareBtnState();
    }

    private setShareBtnState(){
        if(this._shareAwardData.Share >= 2){
            this.shareAwardBtn.enabled = false;
        }else if(this._timeNum > 0){
            this.shareAwardBtn.enabled = false;
        }else{
            this.shareAwardBtn.enabled = true;
        }
    }

    private setState(){
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");
        this.attentionBtn.enabled = true;
        if(!is_sign_in || is_sign_in == "false"){
            //游客
            this.attentionBtn.visible = true;
            this._attentionState = 1;
        }else{
            let is_subscribe = UrlUtils.getQueryString("is_subscribe");

            if(!is_subscribe || is_subscribe == "false"){
                this.attentionBtn.visible = true;
                this._attentionState = 2;
            }else{
                //已经关注公众号
                if(this._subscribeAwardData.Value == 1){
                    //已经领取过奖励
                    this._attentionState = 3;
                    this.attentionBtn.visible = true;
                }else{
                    this.getAwardBtn.visible = true;
                }
            }
        }
    }

    private setTimeNum(){
        // let curTimestamp =   (new Date()).valueOf() / 1000;
        // let serverTimestamp = this._shareAwardData.ShareTime - 28800;
        // // console.log(DateUtils.getInstance().getLocalTime(curTimestamp));
        // this._timeNum = ~~(7200 - (curTimestamp - serverTimestamp));
        this._timeNum = this._shareAwardData.ShareTime;
        if(this._timeNum >= 0 && this._shareAwardData.Share < 2){
            this.shareTimeLabel.visible = true;
        }else{
            this.shareTimeLabel.text = "";
            this.shareTimeLabel.visible = false;
        }
    }

    public onCloseHandler(){
        ViewManager.getInstance().closeView("GiftLayer");
    }

    //关注公众号
    private onAttentionHandler(){
        RgDot.onEvent("click",{"attention":"1"});
        if( this._attentionState == 1){
            //引导登陆
            GameUtils.userLogin();
        }else{
            //打开微信
           GameUtils.followSubscribe();
        }
    }
    
    private onGetAwardHandler(){
        RgDot.onEvent("click",{"attentionAward":"1"});
        if(this._attentionState == 3){
            GameUtils.showConfirmLayer("您已经领取过奖励了",null,null,0);
            return;
        }
        ProxyManager.sendGetSubscribeAward((data)=>{
            if(data.ReturnCode == 6){
                GameUtils.showConfirmLayer("您已经领取过奖励了",null,null,0);
            }else if(data.ReturnCode == 0){
                this._attentionState = 3;
                this.getAwardBtn.visible = false;
                this.attentionBtn.visible = true;
                let getFlashNum = data.ResidueFlash - ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["ResidueFlash"];
                GameUtils.showConfirmLayer(`公众号关注奖励领取成功\n恭喜您获得${getFlashNum}星星关注奖励\n当前剩余星星数:${data.ResidueFlash}`,null,null,0);
                GameUtils.updateResidueFlash(data.ResidueFlash);
                ControlManager.getInstance().applyFunc(GameEvent.updateShareTip);
            }
        },this)
    }

    private onShareAwardHandler(){
        RgDot.onEvent("click",{"shareAward":"1"});
        if(this._attentionState == 1){
            //引导玩家登陆
            GameUtils.userLogin();
        }else{
            if(this._attentionState == 2){
                //未关注
                GameUtils.showConfirmLayer(`关注公众号后分享即可获得星星奖励`,null,null,0);
            }else{
                 //分享
                GameUtils.openPlatformShare();
            }
        }
    }
    public dispose(){
        this._attentionState = 1;
        ControlManager.getInstance().removeListener(GameEvent.shareMessage,this.onMessageHandler,this);
        App.TimerManager.remove(this.onTimeHandler,this);
    }

    private onMessageHandler(e){
        if(this._timeNum >0 || this._attentionState == 1 || this._attentionState == 2){
            return;
        }
        if (e.data != "") {
        　　var rece_info_type = e.data.info_type; // 消息类型
        　　var rece_info_data = e.data.info_data; // 数据内容
        　　switch(rece_info_type){
        　　  case "msg_share_to_moments_resault":
        　　  case "msg_share_to_friend_resault":
                if(rece_info_data == 1){
                    ProxyManager.sendGetShareAward((data)=>{
                        if(data.ReturnCode == 0){
                            let getFlashNum = data.ResidueFlash - ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["ResidueFlash"];
                            let surplusShareNum = 2 - data.Share;
                            GameUtils.showConfirmLayer(`分享成功!\n恭喜您获得${getFlashNum}星星分享奖励\n当前剩余星星数：${data.ResidueFlash}\n今日剩余分享奖励次数：${surplusShareNum}`,null,null,0);
                            GameUtils.updateResidueFlash(data.ResidueFlash);
                            this._shareAwardData.ShareTime= data.ShareTime;
                            this._shareAwardData.Share = data.Share;
                            this.setTimeNum();
                            this.setShareBtnState();
                            ControlManager.getInstance().applyFunc(GameEvent.updateShareTip);
                        }else if(data.ReturnCode == 7){
                            GameUtils.showConfirmLayer(`已经领取2次了`);
                        }else if(data.ReturnCode == 8){
                            GameUtils.showConfirmLayer(`稍安勿躁`);
                        }
                        else{
                            GameUtils.showConfirmLayer(`分享奖励领取失败`);
                        }
                    },this);
                }else{
                    GameUtils.showConfirmLayer(`分享失败`);
                }
        　　　　break;
        　　}
        　}
    }
}