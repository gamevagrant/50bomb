/**
 * Created by Administrator on 2016/8/19.
 */
class BaseEuiView extends eui.Component implements IBaseView
{
    public adaptiveGroup:eui.Group;
    public constructor()
    {
        super();
        this.percentHeight = this.percentWidth = 100;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);

    }
    public openView(...param)
    {

    }
    //x的移动位置
    public getXmove()
    {
        let X = 640 - 640 * App.StageUtils.getGameScaleY(1136);
        return  X>>1;
    }

    private onResizeHandler()
    {
        if(this.adaptiveGroup){
            let scale = App.StageUtils.getGameScaleY(1136);
            this.adaptiveGroup.scaleX = this.adaptiveGroup.scaleY = scale;
            let X = 640 - 640 * scale;
            this.adaptiveGroup.x = X >> 1;
        }
    }

    public onAddedToStage()
    {
        this.onResizeHandler();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
        this.addEventListener(egret.Event.RESIZE, this.onResizeHandler, this);
    }

    private onRemoveFromStage()
    {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
        this.removeEventListener(egret.Event.RESIZE, this.onResizeHandler, this);
    }

    public closeButton:eui.Button;
    public childrenCreated()
    {
        super.childrenCreated();
        if(this.closeButton){
            App.DisplayUtils.registerBtn(this.closeButton,this.onCloseHandler,this);
        }

        this.initView();
    }

    public initView()
    {

    }

    public onCloseHandler()
    {
        ViewManager.getInstance().closeView(this);
    }

    public dispose()
    {
        if(this.closeButton){
            this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseHandler,this);
        }
    }
}