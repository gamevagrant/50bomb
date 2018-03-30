class GameMainLayer extends BaseEuiView
{
    private _control:GameControl;
    private _guiTime:number;
    public constructor()
    {
        super();
        this.skinName = "resource/eui_skins/GameMainLayerSkin.exml";
    }

    public btn:eui.Button;
    public flashBtn:eui.Rect;
    public scoreLabel:eui.Label;
    public starLabel:eui.Label;
    public elementNode:eui.Group;
    public consumeNumLabel:eui.Label;
    public LastScoreLabel:eui.Label;
    public helpButton:eui.Button;
    public rankBtn:eui.Button;
    public shareAwardBtn:eui.Button;
    public shareTip:eui.Image;
    public maxLabel:eui.Label;
    public elementGroupMask:eui.Rect;

    public initView()
    {
        
        App.DisplayUtils.registerBtn(this.rankBtn,this.onRankBtnHandler,this);
        App.DisplayUtils.registerBtn(this.helpButton,this.onOpenHelpHandler,this);
        App.DisplayUtils.registerBtn(this.flashBtn,this.onFlashHandler,this);
        App.DisplayUtils.registerBtn(this.shareAwardBtn,this.onShareAwardHandler,this);

        this.elementNode.touchEnabled = true;
        this.elementNode.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onElementTouchTapHandler,this);

        ControlManager.getInstance().on(GameEvent.totalScoreChange,this.onChangeScoreHandler,this);
        ControlManager.getInstance().on(GameEvent.flashComplete,this.onFlashCompleteHandler,this);
        ControlManager.getInstance().on(GameEvent.updateFlash,this.onUpdateFlashHandler,this);
        ControlManager.getInstance().on(GameEvent.updateShareTip,this.updateShareTip,this);
        this.scoreLabel.text = "0";
        this.starLabel.text = "";
        this.LastScoreLabel.text = "0";
        this.maxLabel.text = "";
        this.elementNode.mask = this.elementGroupMask;
        this.onChangeScoreHandler(GameData.TOTAL_SCORE);
        this.onFlashCompleteHandler();
        this.updateShareTip();
        this.openGuiView();
    }
    private guiStepNum = 1;
    private openGuiView(){
        [1,2,3].map((i)=>{
            if(this["guidanceGroup"+i]){
                this["guidanceGroup"+i].visible = false;
            }
        })
      
        if(GameUtils.isNewUser()){
            this.showGui();
        }
    }

    private nextGui(){
        if(GameUtils.isNewUser()){
            if( this["guidanceGroup"+ (this.guiStepNum+1)]){
                this["guidanceGroup"+this.guiStepNum].visible = false;
                this.guiStepNum++;
                this.showGui();
            }else{
                this._guiTime = null;
                this["guidanceGroup"+this.guiStepNum].visible = false;
            }
        };
        
    }

    private showGui(){
        this["guidanceGroup"+this.guiStepNum].visible = true;
        this._guiTime = egret.getTimer();
    }


    private updateShareTip(){
        ProxyManager.sendQueryShareAward((data)=>{
            let boo = false;
            let is_sign_in = UrlUtils.getQueryString("is_sign_in");
            
            if(is_sign_in || is_sign_in != "false"){
                //登录
                let is_subscribe = UrlUtils.getQueryString("is_subscribe");
                if(!is_subscribe || is_subscribe == "false"){
                    //未关注公众号
                    boo = true;
                 }
            }

            if(data.Share < 2 && data.ShareTime <= 0){
                boo = true;
            }
            this.shareTip.visible = boo;
        },this);
    }

    private onUpdateFlashHandler(){
        this.changeStarLabel();
    }

    private onRankBtnHandler(){
        App.ResourceUtils.loadGroup("rankRes",()=>{
            RgDot.onEvent("open",{"rankLayer":"1"});
            //ViewManager.getInstance().open(GameContainer.UI_BOX_TYPE,"RankLayer");
            ViewManager.getInstance().open(GameContainer.UI_BOX_TYPE,"SettlementLayer");
        },null,this);
    }

    private onOpenHelpHandler(){
        App.ResourceUtils.loadGroup("helpRes",()=>{
            RgDot.onEvent("open",{"helpLayer":"1"});
            ViewManager.getInstance().open(GameContainer.UI_BOX_TYPE,"HelpLayer");
        },null,this);
    }

    private onFlashCompleteHandler(){
        this.changeStarLabel();
        this.changeLastScoreLabel();
        this.changeConsumeNumLabel(); 
    }

    private changeLastScoreLabel(){
        this.LastScoreLabel.text = GameUtils.getLastScore() + "";
    }

    private onShareAwardHandler(){
    
        ProxyManager.sendQueryShareAward((data1)=>{
            ProxyManager.sendQuerySubscribeAward((data2)=>{
                RgDot.onEvent("open",{"shareLayer":"1"});
                ViewManager.getInstance().open(GameContainer.UI_COMMON_TYPE,"GiftLayer",data1,data2);
            },this);
        },this)
        
    }

    /**
     * 变更总星星数
     */
    public changeStarLabel(){
        this.starLabel.text = GameUtils.getResidueFlash() +  "";
        this.maxLabel.text = ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["MaxScore"] || 0;
    }

    /**
     * 变更闪电消费
     */
    public changeConsumeNumLabel(){
        this.consumeNumLabel.text = GameUtils.getFlashPrice() + "";// GameData.flashPrice + "";
    }

    /**
     * 变更积分
     * @param score 总分数 
     */
    private onChangeScoreHandler(score){
        if(score != +this.scoreLabel.text){
            this.scoreLabel.text = score + "";
        }
    }

    public onFlashHandler(){
        egret.Tween.get(this.flashBtn).to({scaleX:1.2,scaleY:0.8},200).to({scaleX:1,scaleY:1},150);
        if(GameUtils.checkoutStarEnough(GameUtils.getFlashPrice())){
            this._control.flashHandler();
        }else{
            GameUtils.showConfirmLayer(`闪电所需星星不足(${GameUtils.getFlashPrice()}/${GameUtils.getResidueFlash()})`, (type) => {
            }, this,0)
        }
    }
   
    public onElementTouchTapHandler(evt:egret.TouchEvent)
    {
        if(this._guiTime && egret.getTimer() - this._guiTime < 1000 ){
            return;
        }
        this.nextGui();
        let id = LocationManager.getElementIDByLocationXY(evt.localX,evt.localY);
        ControlManager.getInstance().applyFunc(GameEvent.elementTouchTap,id);
    }
    
    public openView(control)
    {
        this._control = control;
        this.initMapView();
    }

    private initMapView()
    {
        for(let i=0; i<GameData.ROW_NUM; i++)
            {
                for(let j=0; j<GameData.COL_NUM; j++)
                    {
                        let ID = i * GameData.COL_NUM + j;
                        let elementData = GameData.elementDatas[ID]; 
                        let elementView:GameElementView = GameControl.getInstance().createElementByPool();
                        elementView.setElementData(elementData);
                        this.elementNode.addChild(elementView);
                        elementView.x = (elementView.width + 0 ) * j;
                        elementView.y = (elementView.height + 0) * i;
                        this._control.elements.push(elementView);
                    }
            }
    }

    public renderElement(element){
        if(element){
            this.elementNode.addChild(element);
        }
    }

    public dispose()
    {
         this.elementNode.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onElementTouchTapHandler,this);
         ControlManager.getInstance().removeListener(GameEvent.totalScoreChange,this.onChangeScoreHandler,this);
         ControlManager.getInstance().removeListener(GameEvent.flashComplete,this.onFlashCompleteHandler,this);
         ControlManager.getInstance().removeListener(GameEvent.updateFlash,this.onUpdateFlashHandler,this);
         ControlManager.getInstance().removeListener(GameEvent.updateShareTip,this.updateShareTip,this);
    }
}