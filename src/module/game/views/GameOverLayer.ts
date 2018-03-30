class GameOverLayer extends BaseEuiView
{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/GameOverLayerSkin.exml";
    }

    public btn:eui.Button;
    public rankGroup:eui.Group;
    public awardLabel:eui.Label;
    public totalScoreLabel:eui.Label;
    public shareFBtn:eui.Button;
    public shareFriendsBtn:eui.Button;
    public newRecord:eui.Image;
    public worldRank:eui.Label;
    public beatLabel:eui.Label;

    private percentStr:string;
    private _isNewRecord:boolean;
    public initView()
    {
        App.SoundManager.playEffect("gameEnd_sound_mp3");
        App.DisplayUtils.registerBtn(this.shareFBtn,this.onShareFHandler,this);
        App.DisplayUtils.registerBtn(this.shareFriendsBtn,this.onShareFriendsHandler,this);
        App.DisplayUtils.registerBtn(this.btn,this.onOpenBoxHandler,this);

        this.totalScoreLabel.text = "";
        this.awardLabel.text = "";
        this.beatLabel.text = "";
    }

    public openView(isNewRecord){
        this._isNewRecord = isNewRecord;
        RgDot.onEvent("open",{"gameOverLayer":1});
        this.percentStr = (ProxyManager.getCache([HttpConst.getUserInfo]).Value.Percent).toFixed(2) * 100 + "%";
        this.totalScoreLabel.text = GameData.TOTAL_SCORE + "";
        this.awardLabel.text = GameUtils.getLastEarnedFlash() + "";
        this.beatLabel.text = this.percentStr;
        this.newRecord.visible = this._isNewRecord;
        RgDot.onReward(+this.awardLabel.text,"gameOverAward");
        this.setWorldRank();
    }

    private setWorldRank(){
        ProxyManager.sendSelfRank(1,(data)=>{
            this.worldRank.text = data.Ranking + "";
        },this);
    }

    private onOpenBoxHandler(){
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");
        if(!is_sign_in || is_sign_in == "false"){
             App.ResourceUtils.loadGroup("ifRes",()=>{
                ViewManager.getInstance().open(GameContainer.UI_BOX_TYPE,"InviteFriendLayer",this.restartGame,this);
             },null,this)
        }else{
            this.restartGame();
        }
    }

    private restartGame(){
        ProxyManager.sendGameRefresh(()=>{
            RgDot.onEvent("game",{"restartGame":1});
            GameData.TOTAL_SCORE = 0;
                ProxyManager.getCache(HttpConst.loadMapData)["Model"] = null;
                GameData.initData();
                ViewManager.getInstance().closeView("GameOverLayer");
                GameControl.getInstance().startGame();
            },this);
    }

    private onShareFriendsHandler(){
        RgDot.onEvent("click",{"shareFriend":1});
        ProxyManager.sendSelfRank(1,(data)=>{
            let ranking = data.Ranking || 1;
                let container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
                let templateImg:egret.Bitmap = new egret.Bitmap(RES.getRes("share_template_png"));
                container.width = templateImg.width;
                container.height = templateImg.height;
                container.addChild(templateImg);
    
                let socreLabel = App.DisplayUtils.createTextField(this.totalScoreLabel.text,81,0x76ADAF,362,79);
                socreLabel.x = 85;
                socreLabel.y = 302;
                socreLabel.textAlign = "center";
                container.addChild(socreLabel);
                
                if(ranking > 1000) ranking = "1000+";
                let rankLabel = App.DisplayUtils.createTextField(ranking,30,0x76ADAF);
                rankLabel.x = 275;
                rankLabel.y = 440;
                container.addChild(rankLabel);
    
                let beatLabel = App.DisplayUtils.createTextField(this.percentStr,30,0x76ADAF,80);
                beatLabel.x = 254;
                beatLabel.y = 497;
                beatLabel.textAlign = "center";
                container.addChild(beatLabel);

                if(this._isNewRecord){
                    let recordImg:egret.Bitmap = new egret.Bitmap(RES.getRes("go_xinjilu_png")); 
                    recordImg.x = 120;
                    recordImg.y = 103;
                    container.addChild(recordImg);
                }

                let scale = 0.5;
                let renderTexture:egret.RenderTexture = new egret.RenderTexture();
                egret.ImageLoader.crossOrigin = "anonymous"
                renderTexture.drawToTexture(container,new egret.Rectangle(0,0,container.width,container.height),scale);
                let base64 = renderTexture.toDataURL("image/png",new egret.Rectangle(0,0,container.width,container.height));
                window.document.getElementById("shareMap").style.display = "block",
                window.document.getElementById("shareImg").setAttribute("src", base64);
    
        },this);
    }

    private onShareFHandler(){
        RgDot.onEvent("click",{"shareCircle":1});
        GameUtils.openPlatformShare();
    }
}