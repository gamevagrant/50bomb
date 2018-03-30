class HelpLayer extends BaseEuiBoxView{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/HelpLayerSkin.exml";
    }

    public loginButton:eui.Button;
    public openView(){
        App.DisplayUtils.registerBtn(this.loginButton,this.onCloseHandler,this);
    }
    
    public onCloseHandler(){
        ViewManager.getInstance().closeView("HelpLayer");
    }

}