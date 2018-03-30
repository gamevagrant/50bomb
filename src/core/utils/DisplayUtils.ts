/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
class DisplayUtils extends BaseClass{
    /**
     * 构造函数
     */
    public constructor(){
        super();
    }

    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public createBitmap(resName:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    }

    /**
     * 从父级移除child
     * @param child
     */
    public removeFromParent(child:egret.DisplayObject){
        if(child.parent == null)
            return;
        if(child.parent.hasOwnProperty("removeElement")){
            child.parent["removeElement"](child);
        }else{
            child.parent.removeChild(child);
        }
    }

    /**
     * 获取一个Texture
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public getTexture(resName:string):egret.Texture{
        var texture:egret.Texture = RES.getRes(resName);
        return texture;
    }

    /*
    *添加一个只播放一次的动画效果(该动画已加载)
    * 技能专用
    * */
    public addAndPlayOneSkillArmature(farme,actionName,mc,scX,content,playSpeed,toX,toY,thisObject:any,compFunc:Function,frameFunc:Function,playNum=1,touchEnabled=false,z:number=-1){
        if(!App.DisplayUtils.AllInteDBAction[mc]){
            if(compFunc)
                compFunc.call(thisObject);
            if(frameFunc)
                frameFunc.call(thisObject,"hit");
            return ;
        }
        var dohua: DragonBonesArmature = DragonBonesFactory.getInstance().makeArmature(actionName, mc, playSpeed);
        if(z == 0){
            content.addChildAt(dohua,0);
        }
        else{
            content.addChild(dohua);
        }
        dohua.play(farme, playNum);
        dohua.x = toX;
        dohua.y = toY;
        dohua.scaleX = scX;
        if(scX>0)
            dohua.scaleY = scX;
        if(touchEnabled)
            dohua.touchEnabled =true;
        dohua.addCompleteCallFunc(()=> {
            compFunc && compFunc.call(thisObject);//,content,source
            dohua && dohua.destroy();                
        }, this);
        dohua.addFrameCallFunc((e,label)=>{
            frameFunc && frameFunc.call(thisObject,label);//,content,source
        },this);
        return dohua;
    }

    public static skillAnimationPool:any ={};

    /*
    * 帧事件处理
    * */
    public frameEvent(e,label){
        var targetArr:any =  this["tempData"];
        if(label.indexOf("hurt_") > -1){
            for(var i:number =0;i<targetArr.length;i++){
                var hurtnum:number = Number(label.substr(6,2));
                this.playHurt(targetArr[i],hurtnum);
            }
        }
    }

    /*
    * 播放效果
    * */
    public playHurt(target:any,hurtIndex:number){
        if(target == null || hurtIndex <= 0)
            return;
        if(target.sResData.moreHurtArr.length >= hurtIndex){
            target.loseHp2(target.sResData.moreHurtArr[hurtIndex-1]);
        }
    }

    public AllInteDBAction:any={};
    /**
     * 初始化战斗使用的动画
     */
    public initBattleDragonBones(arr):void{
        for(var i:number=0, len:number=arr.length; i<len; i++){
            var dbName:string = arr[i];
            //if(!App.DisplayUtils.AllInteDBAction[dbName]){
                var skeletonData:any = RES.getRes(dbName+"_skeleton_json");
                var texturePng:egret.Texture = RES.getRes(dbName+"_texture_png");
                var textureData:any = RES.getRes(dbName+"_texture_json");
                App.DisplayUtils.AllInteDBAction[dbName]=1;
                DragonBonesFactory.getInstance().initArmatureFile(skeletonData, texturePng, textureData);

        }
    }

    /*
    * 加载指定龙骨动画
    * */
    public addNewHeroArmature(fileName:string,completeFun:Function,thisObject:any,showLoading,path,otherArr:any = null){
        // if(showLoading)
        //     App.EasyLoading.showLoading();
        App.ResourceUtils.CreateResourceConfigForDB(fileName,path);
        var resArr:any = [fileName+"_texture_png",fileName+"_skeleton_json",fileName+"_texture_json"];
        if(otherArr)
            resArr = resArr.concat(otherArr);
        App.ResourceUtils.loadResource(resArr, [], ()=>{
            // App.EasyLoading.hideLoading();
            this.initBattleDragonBones([fileName]);
            completeFun.apply(thisObject);//,content,source
        }, null, this);
    }

    /**
     * 头像添加圆形遮罩
     * @param w 方形头像宽，高
     * return 遮罩后的图片纹理
     */ 
    public getMaskTexture(w:number,texture: egret.Texture): egret.RenderTexture
    {
        var container = new egret.DisplayObjectContainer();
        var bitmap: egret.Bitmap = new egret.Bitmap(texture);
        bitmap.scaleX = w / texture.textureWidth;
        bitmap.scaleY = w / texture.textureHeight;
        container.addChild(bitmap);

        var mask: egret.Shape = new egret.Shape();
        mask.graphics.beginFill(0xff0000);
        mask.graphics.drawCircle(w/2,w/2,w/2);
        mask.graphics.endFill();
        container.addChild(mask);
        bitmap.mask = mask;

        var headTexture = new egret.RenderTexture();
        headTexture.drawToTexture(container,new egret.Rectangle(container.x,container.y,w,w));
        return headTexture;
    }
    //注册按钮点击事件
    public onClick(btn:eui.Button,cf,ct)
    {
        if(btn && cf && ct){
            App.SoundManager.playEffect("click_mp3");
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,cf,ct);
        }
    }

    public createTextField(text,size,textColor,width=0,height=0,fontFamily="Microsoft YaHei"){
        let textField:egret.TextField = new egret.TextField();
        textField.fontFamily = fontFamily;
        textField.size = size;
        textField.textColor = textColor;
        textField.text = text + "";
        if(width != 0){
            textField.width = width;
        }
        if(height != 0){
            textField.height = height;
        }
        return textField;
    }

    public registerBtn(btn:egret.DisplayObject,cf,ct){
        if(btn){
            btn.touchEnabled = true;
            if(!btn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP,(e)=>{
                    App.SoundManager.playEffect("btn_sound_mp3");
                    cf.call(ct,e);
                },this);
            }
        }
    }
}

