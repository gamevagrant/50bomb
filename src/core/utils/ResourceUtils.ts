/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
class ResourceUtils extends BaseClass{
    private _configs:Array<any> = null;
    private _onConfigComplete:Function = null;
    private _onConfigCompleteTarget:any = null;

    private _groups:any = null;
    private _groupIndex:number = 0;

    /**
     * 构造函数
     */
    public constructor(){
        super();

        this._configs = new Array<any>();
        this._groups = {};

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceError,this);
    }

    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    public addConfig(jsonPath:string, filePath:string):void{
        this._configs.push([jsonPath, filePath]);
    }

    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    public loadConfig($onConfigComplete:Function, $onConfigCompleteTarget:any):void{
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    }

    /**
     * 加载
     */
    private loadNextConfig():void{
        //加载完成
        if(this._configs.length == 0){
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }

        var arr:any = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    }

    /**
     * 加载完成
     * @param event
     */
    private onConfigCompleteHandle(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    }

    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroup($groupName: string,$onResourceLoadComplete: Function,$onResourceLoadProgress: Function,$onResourceLoadTarget: any,$onResourceError:Function=null):void{
        this._groups[$groupName] = [$onResourceLoadComplete,$onResourceLoadProgress,$onResourceLoadTarget,$onResourceError];
        RES.loadGroup($groupName);
    }


    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroups($groupName:string, $subGroups:Array<any>, $onResourceLoadComplete:Function, $onResourceLoadProgress:Function, $onResourceLoadTarget:any):void{
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget)
    }
    /**
     * 静默加载
     * @param $groupName 资源组名称
     */
    public pilfererLoadGroup($groupName:string):void{
        //添加前缀，防止与正常加载组名重复
        RES.loadGroup("pilferer_" + $groupName, -1);
    }

    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        var groupName:string = event.groupName;
        if(this._groups[groupName]){
            var loadComplete:Function = this._groups[groupName][0];
            var loadCompleteTarget:any = this._groups[groupName][2];
            if(loadComplete != null)
                loadComplete.call(loadCompleteTarget);

            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    }

    /**
     * 资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        var groupName:string = event.groupName;
        if(this._groups[groupName]){
            var loadProgress:Function = this._groups[groupName][1];
            var loadProgressTarget:any = this._groups[groupName][2];
            if(loadProgress != null)
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 资源组加载失败
     */
    private onResourceError(event:RES.ResourceEvent):void
    {
        var groupName: string = event.groupName;
        if(this._groups[groupName])
        {
            var loadError: Function = this._groups[groupName][3];
            var loadErrorTarget: any = this._groups[groupName][2];
            if(loadError != null)
                loadError.call(loadErrorTarget);
        }
    }

    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadResource($resources = [], $groups = [], $onResourceLoadComplete:Function = null, $onResourceLoadProgress:Function = null, $onResourceLoadTarget:any = null):void{
        var needLoadArr = $resources.concat($groups);
        var groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    }

    /*
    * huo qu
    * */
    public getDBResourceArr(arr):any{
        var rArr:any =[];
        for(var i:number=0;i<arr.length;i++){
            rArr.push(arr[i]+"_skeleton_json");
            rArr.push(arr[i]+"_texture_json");
            rArr.push(arr[i]+"_texture_png");
        }
        return rArr;
    }

    /*
    * 如不能，需要加对应BD加入Res
    * */
    public CreateResourceConfigForDB(animationName,path){
        if( RES.hasRes(animationName+"_skeleton_json")) return false;
        var key1:any = animationName+"_skeleton_json";
        var key2:any = animationName+"_texture_png";
        var key3:any = animationName+"_texture_json";
        RES["configInstance"].keyMap[key1] = {name: key1,type: "json",url: path+animationName+"/"+animationName+"_skeleton.json"};
        RES["configInstance"].keyMap[key2] = {name: key2,type: "image",url: path+animationName+"/"+animationName+"_texture.png"};
        RES["configInstance"].keyMap[key3] = {name: key3,type: "json",url: path+animationName+"/"+animationName+"_texture.json"};
        return true;
    }

    public CreateResourceConfigForImage(keyName,type,path){
        if( RES.hasRes(keyName+"_"+type)) return false;
        RES["configInstance"].keyMap[keyName+"_"+type] = {"name": keyName+"_"+type,"type": "image","url": path+keyName+"."+type};
        return true;
    }

    //加载图片
    public loadImg(url,cf,ct){
        HttpManager.loadImg(decodeURIComponent(url)).then((texture)=>{
            if(cf && ct) cf.call(ct,texture);
        }).catch((e)=>{
            console.log(e);
        })
    }
}

