class InviteFriendLayer extends BaseEuiBoxView{
    private _cf:Function;
    private _ct:any;
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/InviteFriendLayerSkin.exml";
    }

    public loginButton:eui.Button;
    public headImg:eui.Image;
    public maskImg:eui.Image;
    public openView(cf,ct){
        this._cf = cf;
        this._ct = ct;
        
        App.DisplayUtils.registerBtn(this.loginButton,this.onLoginHandler,this);
        this.loadHeadImg();
    }

    private loadHeadImg(){
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

    private onLoginHandler(){
        let post_data:any = {};
        post_data.is_debug = false; // 是否调试模式
        post_data.info_type = "msg_auth_verify_fail"; // 消息类型
        post_data.info_data = {}; // 数据内容
        window.parent.postMessage(post_data, '*');
    }

    public onCloseHandler(){
        ViewManager.getInstance().closeView("InviteFriendLayer");
        if(this._cf && this._ct){
            this._cf.call(this._ct);
        }
    }
}