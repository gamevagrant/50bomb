/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
class StageUtils extends BaseClass{
    //UIStage单例
    private static _uiStage:any;
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    public getHeight():number {
        return egret.MainContext.instance.stage.stageHeight;
    }
    public getTrueHeight():number {
            return egret.MainContext.instance.stage.stageHeight;
    }
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    public getWidth():number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren(value:boolean):void {
        egret.MainContext.instance.stage.touchChildren = value;
    }

    /**
     * 指定此对象是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchEnabled(value:boolean):void {
        egret.MainContext.instance.stage.touchEnabled = value;
    }
    public getGameScaleY(value):number {
        return App.StageUtils.getHeight()/value;
    }
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    public getStage():egret.Stage{
        return egret.MainContext.instance.stage;
    }

    /**
     * 获取唯一UIStage
     * @returns {egret.gui.UIStage}
     */
    public getUIStage():any{
        return StageUtils._uiStage;
    }

    public getCenterY(y) {
        return (App.StageUtils.getHeight() - 1136)/2 + y;
    }

    public getLayoutY(y) {
        return App.StageUtils.getHeight() - 1136 + y;
    }

    public getWidthScale(){
        return document.documentElement.clientWidth / 640
    }


}
