class RankLayer extends BaseEuiView{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/RankLayerSkin.exml";
    }

    public tabBar:eui.TabBar;
    public viewStack:eui.ViewStack;
    public tabBarContainer:TabContainer;
    public friendList:eui.List;
    public worldList:eui.List;
    public scroller:eui.Scroller;
    public scroller1:eui.Scroller;
    public closeButton:eui.Button;
    public inviteBtn:eui.Button;
    public selfInfoGroup:eui.Group;

    private friendArray:Array<any>;
    private friendArrayCollection:eui.ArrayCollection;

    private worldArray:Array<any>;
    private worldArrayCollection:eui.ArrayCollection;

    private sendListLock:boolean;
    private _currentIndex;
    

    public onTabBarChangeHandler(e){
        this.sendListLock = false;
        this._currentIndex = e.data;
        this.renderView(e.data);
    }

    public openView(){
        this.tabBarContainer = new TabContainer(this.tabBar,this.viewStack);
        this.tabBarContainer.addEventListener("tabBarCutChange",this.onTabBarChangeHandler,this);
        this.tabBarContainer.tabBarBuild(TabItem,[
           {"upImg":"btn_sel_png","downImg":"btn_nor_png","name":"好友排行"},
            {"upImg":"btn_sel_png","downImg":"btn_nor_png","name":"世界排行"},
        ]);

        this.friendArray = [];
        this.friendList.itemRenderer = RankItemRenderer;
        this.friendArrayCollection = new eui.ArrayCollection();
        this.friendList.dataProvider = this.friendArrayCollection;
        
        
        this.worldArray = [];
        this.worldList.itemRenderer = RankItemRenderer;
        this.worldArrayCollection = new eui.ArrayCollection();
        this.worldList.dataProvider = this.worldArrayCollection;


        this.scroller.verticalScrollBar.autoVisibility = false;
        this.scroller.horizontalScrollBar.autoVisibility = false;
        this.scroller1.verticalScrollBar.autoVisibility = false;
        this.scroller1.horizontalScrollBar.autoVisibility = false;

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScrollerChangeHandler,this);
        this.scroller1.addEventListener(egret.Event.CHANGE,this.onScrollerChangeHandler,this);

        App.DisplayUtils.registerBtn(this.closeButton,this.onCloseHandler,this);
        App.DisplayUtils.registerBtn(this.inviteBtn,this.onInviteHandler,this);

        this._currentIndex = 0;
        this.sendListData(this._currentIndex,0,10);
        this.sendListData(1,0,10);
        this.renderView(this._currentIndex);

        //游客的话 不展示自己的信息
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");
        if(!is_sign_in || is_sign_in == "false"){
            this.selfInfoGroup.visible = false;
        }else{
            this.selfInfoGroup.visible = true;
        }
    }

    private onScrollerChangeHandler(e:egret.Event){
        if(this.sendListLock)return;
        let top = this.scroller1.viewport.contentHeight - this.scroller1.viewport.height;
        if(this.scroller1.viewport.scrollV >= top){
            this.sendListLock = true;
            let listData = this._currentIndex == 0?this.friendArray:this.worldArray;
            let startIndex = listData.length;
            let endIndex = startIndex + 10;
            if(endIndex >100 || startIndex > 90)return;
            if(!this.checkoutIsHasData(this._currentIndex,endIndex)){
                this.sendListData(this._currentIndex,startIndex,10);
            }
        }
    }

    private checkoutIsHasData(type,end){
        let listData = type == 0?this.friendArray:this.worldArray;
        return  listData.some((data)=>{
            return data.Ranking == end;
        })
    }

    private sendListData(type,start,end){
        ProxyManager.sendQueryRanks(type,start,end,(data)=>{
            if(data.Value && data.Value.length > 0){
                if(type == 0){
                    this.friendArray.push(...data.Value);
                    data.Value.forEach(element => {
                        this.friendArrayCollection.addItem(element);
                    });
                }else if(type == 1){
                    this.worldArray.push(...data.Value);
                    data.Value.forEach(element => {
                        this.worldArrayCollection.addItem(element);
                    });
                }
                this.sendListLock = false;
            }
        },this);
    }

    private renderView(type){
        this.renderSelfView(type);
    }

    public scoreLabel:eui.Label;
    public rankImg:eui.Image;
    public rankLabel:eui.Label;
    public headImg:eui.Image;
    public nameLabel:eui.Label;
    public maskImg:eui.Rect;

    private selfFriendData;
    private selfWorldData;
    private renderSelfView(type){
        if( (this._currentIndex == 0 && this.selfFriendData) || (this._currentIndex == 1 && this.selfWorldData)){
            let data = this._currentIndex == 0?this.selfFriendData:this.selfWorldData;
            this.updateSelf(data);
            return;
        }
        ProxyManager.sendSelfRank(type,(data)=>{
            if(type == 0){
                this.selfFriendData = data;
            }else{
                this.selfWorldData = data;
            }
            this.updateSelf(data);
        },this)
    }

    private updateSelf(data){
        if(data.ReturnCode == 0){
            if(data.Ranking <= 3){
                this.rankLabel.text = "";
                this.rankImg.visible = true;
                this.rankImg.source = `icon_${data.Ranking}_png`
            }else{
                this.rankImg.visible = false;
                this.rankLabel.text = data.Ranking;
            }
            this.setUserHeadImg();
            this.nameLabel.text = ProxyManager.getCache(HttpConst.getUserInfo).Value.UserName;
            this.scoreLabel.text = data.MaxScore + "";
        }
    }

    
    private setUserHeadImg(){
        let userImgURL = decodeURIComponent(UrlUtils.getQueryString("user_img_url"));
        if(userImgURL && userImgURL != "null"){
             this.headImg.mask = this.maskImg;
             let url = "http://h5.dodgame.com.cn/api/getimg?url=" + userImgURL;
             App.ResourceUtils.loadImg(url,(texture)=>{
                if(texture){
                    this.headImg.texture = texture;
                  }
            },this);
        }else{
            this.maskImg.visible = false;
        }
    }

    public onCloseHandler(){
        ViewManager.getInstance().closeView("RankLayer");
    }

    public onInviteHandler(){
        GameUtils.openPlatformShare();
    }
}