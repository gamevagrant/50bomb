/**
 * Created by Administrator on 2016/8/19.
 */
class ViewManager extends BaseClass
{

    public views:any = {};
    public open(parentName:string,ViewName:any,...param)
    {
        if(this.views[ViewName]){
            return;
        }
        let parent = GameContainer.getInstance().getContainer(parentName);
        if(parent)
        {
            let viewClass = egret.getDefinitionByName(ViewName);
            let view = new viewClass();
            if(view){
                this.childView(parent,view,param);
                this.views[ViewName] = view;
            }
        }else{
            console.log("父级容器不存在");
        }
    }

    private childView(parent,container,param)
    {
        let name = parent.name;
        switch (name)
        {
            case GameContainer.UI_COMMON_TYPE:
            case GameContainer.UI_TIP_TYPE:
                parent.addChild(container);
                container["openView"] &&  container.openView.apply(container,param);
                break;
            case GameContainer.UI_BOX_TYPE:
                let len = parent.numChildren;
                for(let i=0; i<len; i++){
                    var view :IBaseView = parent.getChildAt(i);
                    if(view){
                        view.dispose && view.dispose();
                        parent.removeChild(view);
                    }
                }
                parent.addChild(container);
                // container.boxShow && container.boxShow();
                container["openView"] &&  container.openView.apply(container,param);
                break;

        }

    }

    public closeView(viewName:any)
    {
        let view = this.views[viewName];
        if(view && view.parent){
            view.dispose();
            view.boxHide && view.boxHide();
            view.parent.removeChild(view);
            delete this.views[viewName];
        }
    }

    public getView(viewName){
        let view = this.views[viewName];
        if(view){
            return view;
        }else{
            console.log(`没有${viewName}界面`);
        }

    }
}