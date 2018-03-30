class TabContainer extends egret.DisplayObject
{
    private _tabBar:eui.TabBar;
    private _viewStack:eui.ViewStack;
    public constructor(tabBar,viewStack){
        super();
        this._tabBar = tabBar;
        this._viewStack = viewStack;
        this._tabBar.addEventListener(egret.Event.CHANGING,this.onTabBarCutHandler,this);
	
       
        this.setViewStackIndex(0);
    }

    private onTabBarCutHandler(){
        this.setViewStackIndex(this._tabBar.selectedIndex);
        this.dispatchEventWith("tabBarCutChange",false,this._tabBar.selectedIndex);
    }

    public tabBarBuild(TabItem,array:Array<any>){ 
        if(this._tabBar){
            this._tabBar.itemRenderer = TabItem;
            this._tabBar.dataProvider = new eui.ArrayCollection(array);
        }else{
            console.error("tabBar不能为空");
        }
    }

    /**
     * 设置viewStack 显示索引
     * @param index 索引
     */
    public setViewStackIndex(index){
        if(this._viewStack){
            this._viewStack.selectedIndex = index;
        }else{
            console.error("viewStack不能为空");
        }
    }
}