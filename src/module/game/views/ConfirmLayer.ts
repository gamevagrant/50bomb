class ConfirmLayer extends BaseEuiBoxView
{
    private _cf:any;
    private _ct:any;
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/ConfirmLayerSkin.exml";
    }

    public contentLabel:eui.Label;
    public okBtn:eui.Button;
    public okBtn1:eui.Button;
    public cancelBtn:eui.Button;
    public openView(text,cf,ct,type=1){
        
        if(type != 1){
            this.okBtn1.visible = true;
            this.cancelBtn.visible = false;
            this.okBtn.visible = false;
        }else{
            this.okBtn1.visible = false;
        }

        this._cf = cf;
        this._ct = ct;

        this.contentLabel.text = text + "";
        this.contentLabel.lineSpacing = 5;
        App.DisplayUtils.registerBtn(this.okBtn,this.onTouchTapHandler,this);
        App.DisplayUtils.registerBtn(this.okBtn1,this.onTouchTapHandler,this);
        App.DisplayUtils.registerBtn(this.cancelBtn,this.onTouchTapHandler,this);

    }

    private onTouchTapHandler(evt:egret.TouchEvent){
        if(evt.currentTarget.name == "okBtn"){
            if(this._cf && this._ct)this._cf.call(this._ct,ConfirmType.ok);
        }else{
            if(this._cf && this._ct)this._cf.call(this._ct,ConfirmType.cancel);
        }
        ViewManager.getInstance().closeView("ConfirmLayer");
    }
}
enum ConfirmType{
    ok=1,
    cancel
}