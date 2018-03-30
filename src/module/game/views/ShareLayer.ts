class ShareLayer extends BaseEuiView{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/ShareLayerSkin.exml";
    }

    public initView(){
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTapHandler,this);
    }

    private onTouchTapHandler(){
        ViewManager.getInstance().closeView("ShareLayer");
    }


}