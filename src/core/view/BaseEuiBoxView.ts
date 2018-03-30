/**
 * 弹出框
 * Created by Administrator on 2016/8/19.
 */
class BaseEuiBoxView extends BaseEuiView
{
    public box:eui.Group;
    public mask:any;
    public contentLabel:any;
    public childrenCreated()
    {
        super.childrenCreated();
        if(this.mask){
            this.mask.touchEnabled = true;
            this.mask.height = egret.MainContext.instance.stage.stageHeight;
        }
        this.anchorOffsetX = this.width >> 1;
        this.anchorOffsetY = this.height >> 1;
        this.y = this.height >> 1;
        this.x = this.width >> 1;
        this.alpha = this.scaleX = this.scaleY = 0;
        this.boxShow();
    }

    public boxShow()
    {
        egret.Tween.get(this).to({alpha:1,scaleX:1,scaleY:1},300,egret.Ease.bounceInOut);
    }
    public boxHide()
    {

    }

}
