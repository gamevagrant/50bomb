/**
 * 游戏容器 分层
 * Created by Administrator on 2016/8/19.
 */
class GameContainer extends egret.DisplayObjectContainer
{

    private static _instance:GameContainer;
    public static UI_TIP_TYPE:string = "tip";
    public static UI_BOX_TYPE:string = "box";
    public static UI_COMMON_TYPE:string = "common";
    public init(parent:egret.DisplayObjectContainer)
    {

        this.createContainer(GameContainer.UI_COMMON_TYPE);
        this.createContainer(GameContainer.UI_BOX_TYPE);
        this.createContainer(GameContainer.UI_TIP_TYPE);
        parent.addChild(this);

    }
 
    public getContainer(name)
    {
        let container = this.getChildByName(name);
        if(container){
            return container;
        }else{
            console.log(name + "  不存在");
        }
    }

    private createContainer(name)
    {
        if(!this.getChildByName(name))
        {
            let container = new egret.DisplayObjectContainer();
            container.name = name;
            if(this){
                this.addChild(container);
            }
        }
    }

    public static getInstance()
    {
        if(!this._instance)
            this._instance = new GameContainer();
        return this._instance;
    }
}