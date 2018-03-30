class GameControl extends BaseClass
{
    private _elements:any;
    private _elementsPool:any;//elementView对象池
    private _canFuseElementList:any;//可以融合的元素列表
    private _activateElementList:any;//可激活的元素列表
    private _clickLock:boolean;//点击锁
    private _view:GameMainLayer;
    private _currenGameState; //当前的游戏状态
    public initGame()
    {
        this._elements = [];
        this._elementsPool = [];
        GameConfig.initConfig();
        GameData.initData();
        this._currenGameState = GameState.normal;
        this.createElementsPool();
        this.onEvent();
        this.startGame();
    }

    /**
     * 创建元素对象(放入对象池)
     */
    private createElementsPool()
    {
        let len = GameData.COL_NUM * GameData.ROW_NUM;
        for(let i=0; i<len; i++){
            let elementView:GameElementView = new GameElementView();
            this._elementsPool.push(elementView);
        }
    }
    private _historyState:number = -1;
    private onEvent(){
        let self = this;
        location.hash = "#1";
        window.addEventListener("hashchange", ()=>{
            if(this._historyState == -1){
                this._historyState = 0;
            }else if(self._historyState == 0){
                self.onCloseGameHandler();
            }else{
                window.history.back();
            }
        }, false);

        window.addEventListener("message",(e)=>{
            ControlManager.getInstance().applyFunc(GameEvent.shareMessage,e);
        },false);
        ControlManager.getInstance().on(GameEvent.elementTouchTap,this.onElementTouchTapHandler,this);
        
    }

    private onCloseGameHandler(){
        GameUtils.showConfirmLayer("是否保存游戏进度",(data)=>{
            if(data == ConfirmType.ok){
                this.saveGameData(()=>{
                    RgDot.onEvent("save",{"save":"true"});
                    window.history.back();
                },this);
            }else{
                RgDot.onEvent("save",{"save":"false"});
                this._historyState = 1;
                window.history.back();
            }
        },this);
        RgDot.onPageLeave();
    }

    public resetGame(){
        
        MapControl.getInstance().resetMap();
        for(let i=this._elements.length-1; i>=0; i--){
            let element = this._elements.splice(i,1)[0];
            if(element.parent){
                 element.parent.removeChild(element);
            }
            this.removeElementByPool(element);
        }
    }

    public startGame()
    {
         MapControl.getInstance().initMap();
         ViewManager.getInstance().open(GameContainer.UI_COMMON_TYPE,"GameMainLayer",this);
         this._view = ViewManager.getInstance().getView("GameMainLayer");
         this.elementDoFuse();
    }

    private gameOverHandler(){
        /*
        App.ResourceUtils.loadGroup("gameOverRes",()=>{
            let isNewRecord = GameUtils.isNewRecord();
             ProxyManager.sendGameOver(GameData.TOTAL_SCORE,UrlUtils.getQueryString("user_img_url"),()=>{
                ViewManager.getInstance().closeView("GameMainLayer");
                ViewManager.getInstance().open(GameContainer.UI_COMMON_TYPE,"GameOverLayer",isNewRecord);
                    this.resetGame();
                },this);
        },null,this);
        */
        ProxyManager.sendGameOver(GameData.TOTAL_SCORE,UrlUtils.getQueryString("user_img_url"),()=>
        {
            ViewManager.getInstance().closeView("GameMainLayer");
            ViewManager.getInstance().open(GameContainer.UI_COMMON_TYPE,"SettlementLayer");
            this.resetGame();
        },this);
        
    }

    private getSaveData(){
        let info = {};
        let mapArr = this.elements.map((elementView:GameElementView)=>{
            return {"t":elementView.getElementData().type,"i":elementView.getElementData().integral};
        });

        info["map"] = [];
        let rowArr;
        while(mapArr.length){
            rowArr = mapArr.splice(0,GameData.ROW_NUM);
            info["map"].push(rowArr);
        }

        info["score"] = GameData.TOTAL_SCORE;
        return JSON.stringify(info);
    }

    private saveGameData(cf,ct){
        let model = this.getSaveData();
        ProxyManager.sendSaveMapData(model,(data)=>{
            if(data["ReturnCode"] == 0){
                console.log("数据保存成功");
                cf.call(ct);
            }
        },this);
    }

    /**
     * 元素点击
     * 1.检测是否可消除 
     */
    private onElementTouchTapHandler(id)
    {
        let gameElement:GameElementView = this.getElement(id);
        let eliminates = this.getIsEliminateList(gameElement);
        if(this._currenGameState == GameState.normal){
            if(this._clickLock)return;
            if(eliminates){
                App.SoundManager.playEffect("ms_sound_mp3");
                this._clickLock = true;
                let upElements = this.getElementsUpElements(eliminates);
                this.hideElementsBorder(upElements);
                this.playElementGatherTween(gameElement,eliminates,upElements);
            }else{
                App.SoundManager.playEffect("mf_sound_mp3");
            }
        }else if(this._currenGameState == GameState.flash){
             ProxyManager.sendEliminateRefresh((data)=>{
                RgDot.onEvent("useFlash",{"flashPrice":this._oldFlashPrice + ""});
                RgDot.onPurchase("useFlash",1,this._oldFlashPrice);
                this._clickLock = true;
                this.delectAppointedElements([gameElement]);
                this._currenGameState = GameState.normal;
                ControlManager.getInstance().applyFunc(GameEvent.flashComplete);
             },this);
        }
    }

    /**
     * 隐藏元素边框
     */
    private hideElementsBorder(elements){
        for(let element of elements){
           
            let id = element.getElementData().ID;
            let borders =  element.getBorderUponRecord();
            
            if(borders && borders.length > 0){
                let fourDirs = LocationManager.getAllDirElementIdsById(id);
                for(let i=0; i<borders.length; i++){
                    let dir = borders[i];
                    let connectElement = this.getElement(fourDirs[dir-1]);
                    let connectDir = this.dirTransition(dir);
                    let connectBorders = connectElement.getBorderUponRecord();
                    let connectIndex = connectBorders.indexOf(connectDir);
                    if(connectIndex != -1){
                        connectBorders.splice(connectIndex,1);
                        connectElement.showBorder(false);
                    }
                }
            }
            element.setBorderUponRecord([]);
            element.showBorder(false);
        }
    }

    /**
     * 方向转换
     */
    private dirTransition(dir){
        if(dir == ElementBorderDir.left){
            return ElementBorderDir.right;
        }else if(dir == ElementBorderDir.right){
            return ElementBorderDir.left;
        }else if(dir == ElementBorderDir.up){
            return ElementBorderDir.bottom;
        }else if(dir == ElementBorderDir.bottom){
            return ElementBorderDir.up;
        }
    }

    /**
     * 获取元素组上方所有的元素
     */
    private getElementsUpElements(targetElements){
        let cols = {};
        for(let i=0; i<targetElements.length; i++){
            let currenEle = targetElements[i];
            let position = LocationManager.getElementLocationById(currenEle.getElementData().ID);
            let arr = cols[position["col"]];
            if(!arr){
                arr = [];
                cols[position["col"]] = arr;
            } 
            arr.push(currenEle);
        }
        let resultArr = [];
        for(let col in cols){
            let eles = cols[col];
            eles.sort((objA,objB)=>{
                let rowA = LocationManager.getElementLocationById(objA.getElementData().ID)["row"];
                let rowB = LocationManager.getElementLocationById(objB.getElementData().ID)["row"];
                return rowB - rowA;
            })
            resultArr.push(eles.shift());
        }

        let upList = [];
        for(let element of resultArr){
            let eId = element.getElementData().ID;
            let colAllElements = this.getElementsAllColById(eId);
            let filters = colAllElements.filter((eView)=>{
                let eViewId = eView.getElementData().ID;
                if(!this.checkoutIncludeByElement(targetElements,eViewId) && element.getElementData().ID > eViewId){
                    return eView;
                }
            })
            upList.push(...filters);
        }
        return upList;
    }

    /**
     * 检测是否包含此元素
     */
    private checkoutIncludeByElement(arr:Array<GameElementView>,id){
        let ids = arr.map((element)=>{
            return element.getElementData().ID;
        })

        if(ids.indexOf(id) == -1){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 检测此id元素是否可向下移动
     * @param element 
     */
    private checkoutUpIsMoveById(id){
        let upId = id + GameData.ROW_NUM;
        let isBorder = upId >= this.elements.length;
        if(this.elements[upId] || isBorder){
            return false;
        }else{
            return true;
        }
    }


    /**
     * 播放元素聚集缓动
     * @param target 聚集目标元素
     * @param eliminates 聚集元素池
     * @param upElements 上方元素池
     */
    private playElementGatherTween(target:GameElementView,eliminates,upElements)
    {
        let eLen = eliminates.length;
        let checkoutNum = eLen -1;
        let eliminateCountArr = [];
        let delectElementsID = [];
        let integralArr = [];
        let oldElementType;
        eliminates.forEach( (element,i) => {
            element.setBorderUponRecord([]);
            element.resetBorder(true);
            if(element.getElementData().ID != target.getElementData().ID){
                delectElementsID.push(element.getElementData().ID);
                integralArr.push(element.integral);
                this.recycleElement(element);
                egret.Tween.get(element).to({x:target.x,y:target.y},220).call(()=>{
                        eliminateCountArr.push(i);
                        element.parent.removeChild(element);
                        let integral = integralArr.shift();
                        target.addIntegral(integral);
                        if(eliminateCountArr.length == checkoutNum){
                            oldElementType = target.getElementData().type;
                            target.renderIntegralLabel();
                            target.checkoutUpgradeElement();
                            let checkoutScoreType = oldElementType == GameData.upgradeType?2:1;
                            this.changeTotalScore(checkoutScoreType,eLen);
                            this.removeCanFuseElement(eliminates);
                            this.generateNewElement(delectElementsID);
                            this.playElementUpTweenMove(()=>{
                                this.checktoutExtraEliminate(target,checkoutNum,oldElementType);
                            },this);
                        }
                });
            }
        });
    }

    /**
     * 删除指定的元素 *可掉落
     * @param eliminates 
     */
    private delectAppointedElements(eliminates){
        if(eliminates.length <= 0)return;
        let delectElementIDs = eliminates.map((element)=>{
            return element.getElementData().ID;
        })
        let upElements = this.getElementsUpElements(eliminates);
        this.hideElementsBorder([...upElements,...eliminates]);

        for(let i=eliminates.length-1; i>=0; i--){
            let element = eliminates[i];
            this.recycleElement(element);
        }
                    
        this.generateNewElement(delectElementIDs);
        this.playElementUpTweenMove(()=>{
              this.elementDoFuse();
        },this);    
    }

    /**
     * 检测额外的移除  
     * type 4 的元素 可额外移除其他元素
     */
    private checktoutExtraEliminate(element,num,type){
        let addSelf = function(arr){
            arr.push(element);
            return arr;
        }

        if(type == GameData.upgradeType){
            App.SoundManager.playEffect("rm50_sound_mp3");
            let eId = element.getElementData().ID;
            switch(num){
                case 1:
                case 2:
                    this.delectAppointedElements(addSelf(this.getElementsByIds(LocationManager.getAllDirElementIdsById(eId,1,2))));
                    break;
                case 3:
                    this.delectAppointedElements(addSelf(this.getElementsByIds(LocationManager.getAllDirElementIdsById(eId,1,1))));
                    break;
                case 4:
                    this.delectAppointedElements(addSelf(this.getElementsByIds(LocationManager.getOnecircleElementIdsById(eId,1))));
                    break;
                case 5:
                case 6:
                    let oneCircle6 = LocationManager.getOnecircleElementIdsById(eId,1);
                    let allDir6 = LocationManager.getAllDirElementIdsById(eId,2,2);
                    this.delectAppointedElements(addSelf(this.getElementsByIds([...oneCircle6,...allDir6])));
                    break;
                case 7:
                    let oneCircle7 = LocationManager.getOnecircleElementIdsById(eId,1);
                    let allDir7 = LocationManager.getAllDirElementIdsById(eId,2,1);
                    this.delectAppointedElements(addSelf(this.getElementsByIds([...oneCircle7,...allDir7])));
                    break;
                 case 8:
                    this.delectAppointedElements(addSelf(this.getElementsByIds(LocationManager.getOnecircleElementIdsById(eId,2))));
                    break;
                 default:
                    this.delectAppointedElements(this.elements);
                    break; 
            }
        }else{
              this.elementDoFuse();
        }
    }

    /**
     * 基于id数据 获取元素 *多个
     */
    private getElementsByIds(ids){
        let list = [];
        for(let id of ids){
            let element = this.getElement(id);
            if(id != -1 && element){
                list.push(element);
            }
        }
        return list;
    }



    /**
     * 回收元素
     * @param element 
     */
    private recycleElement(element){
        let eId = element.getElementData().ID;
        this.delectElement(eId);
        this.removeElementByPool(element);
        
        let allColElements = this.getElementsAllColById(eId);
        for(let i=0; i<allColElements.length; i++){
            let cId = allColElements[i].getElementData().ID;
            if(cId < eId){
                let newId = cId + GameData.ROW_NUM;
                allColElements[i].setElementDataId(newId);
            }
        }
    }

    /**
     * 获取整列元素基于id
     * @param id 
     */
    private getElementsAllColById(id){
        let col = LocationManager.getElementLocationById(id)["col"];
        return this.elements.filter((element)=>{
            if(element){
                let curId = element.getElementData().ID;
                let curCol =  LocationManager.getElementLocationById(curId)["col"];
                if(curCol == col){
                    return element;
                }
            }
        })
    }

    //元素向下移动 * 
    private playElementUpTweenMove(cf,ct){
        let lsArr = [];
        let count = 0;
        for(let i=0; i<this.elements.length; i++){
            let eView = this.elements[i];
            if(eView){
                //全部解除 用于下次融合检测
                eView.setIsCheckout(false);
                let id = eView.getElementData().ID;
                let xyData = LocationManager.getElementLocationXYById(id);
                if(eView.x != xyData.x || eView.y != xyData.y){
                    lsArr.push(1);
                    egret.Tween.get(eView).to({x:xyData.x,y:xyData.y},350).call(()=>{
                        count++;
                        if(lsArr.length == count){
                            this.elementSortByID();
                            if(cf && ct)cf.call(ct);
                        }
                    })
                }
            }
        }
    }


    //元素排序 基于id 从小到大
    private elementSortByID(){
        this.elements.sort((elementA,elementB)=>{
            let idA = elementA.getElementData().ID;
            let idB = elementB.getElementData().ID;
            return idA - idB;
        })
    }

    /**
     * 生产新元素
     * @param elementsID 
     */
    private generateNewElement(elementsID){

        let obj = {};
        for(let j=0; j<elementsID.length; j++){
            let id = elementsID[j];
            let location = LocationManager.getElementLocationById(id);
            let col = location["col"];
            if(!obj[col]){
                obj[col] = [];
            }
            obj[col].push(location);
        }


        for(let key in obj){
            let locations = obj[key];
            let len = locations.length -1;
            for(let i=0; i<locations.length; i++){
                let location = locations[i];
                let newElement = this.createElementByPool();
                newElement.x = location["col"] * newElement.width;
                newElement.y = (i+1) * (-newElement.height);
                let realY = (len - i) * newElement.height;
                let newId = LocationManager.getElementIDByLocationXY(newElement.x,realY);
                newElement.setElementDataId(newId);
                newElement.type = GameData.getRandomType();
                this.elements.push(newElement);
                this._view.renderElement(newElement);
            }
        }
    }

    //删除指定可融合内的元素组
    private removeCanFuseElement(elements){
        for(let i=0; i<this._canFuseElementList.length; i++){
            let list = this._canFuseElementList[i];
            let boo = list.some((element:GameElementView)=>{
                let data:GameElement = element.getElementData();
                if(data.ID == elements[0].getElementData().ID){
                    return true;
                }
            })
            if(boo){
                this._canFuseElementList.splice(i,1);
                break;
            }
        }
    }

    /**
     * 检测是否可消除
     */
    private getIsEliminateList(gameElement:GameElementView)
    {
        for(let list of this._canFuseElementList){
            let boo = list.some((element:GameElementView)=>{
                let data:GameElement = element.getElementData();
                if(data.ID == gameElement.getElementData().ID && list.length >= 3){
                    return true;
                }
            })
            if(boo){
                return list;
            }
        }
        return null;
    }

    /**
     * 检测是否使用道具
     */
    private checkoutIsUseProp(){
       
    }

    /**
     * 元素融合
     */
    private _oldFlashPrice;
public elementDoFuse()
{
    this._canFuseElementList = this.getCanFuseElements(this.elements);
    this._activateElementList = [];
    if (!this.checkoutGameOver()) {
        let flashPrice = GameUtils.getFlashPrice();
        this._oldFlashPrice = flashPrice;
        if (GameUtils.checkoutStarEnough(flashPrice)) {
            GameUtils.showConfirmLayer(`是否消耗${flashPrice}个星星 使用闪电道具(可任意消除一个方块)`, (type) => {
                if (type === ConfirmType.ok) {
                    RgDot.onEvent("die",{"flashPrice":flashPrice});
                    this._currenGameState = GameState.flash;
                } else {
                    RgDot.onEvent("die",{"cancel":1});
                    this.gameOverHandler();
                }
            }, this)
        }else{
             this.gameOverHandler();
        }

    } else {
        this._clickLock = false;
        this._canFuseElementList.forEach(elementList => {
                elementList.forEach(element => {
                    element.showBorder();
                });
            });
    }
}

     /**
      * 检测游戏是否结束 true 未结束  false 结束
      */
    private checkoutGameOver(){
        return this._canFuseElementList.some((elesments)=>{
            if(elesments.length >= 3){
                return true;
            }
        })
    }

    /**
     * 获取可融合的元素
     */
    private getCanFuseElements(elements,cf=null,ct=null){
        let canFuseElements = [];
         for(let i=0; i<elements.length; i++)
            {
                let elementView = elements[i];
                let sameTypeArr = [];
                if(elementView.getIsCheckout()){
                    continue;
                }else{
                    //输出相同类型的元素*可融合
                    this.outputSameTypeElement(elementView,sameTypeArr,cf,ct);
                }
                if(sameTypeArr.length >= 3){
                    canFuseElements.push(sameTypeArr);
                }else{
                    sameTypeArr.forEach((element)=>{
                        element.setBorderUponRecord([]);
                        element.showBorder(false);
                    })
                }
            }
        return canFuseElements;
    }

    /**
     * 输出相邻元素同类型可消除的元素数据
     * @param element 
     * @param signArr 
     */
    private outputSameTypeElement(element:GameElementView,signArr,cf=null,ct=null)
    {
        element.setIsCheckout(true);
        signArr.push(element);
        let dirElements = this.checkoutDirIsSameType(element,cf,ct);
        while(dirElements.length){
            let currenElement:GameElementView = dirElements.pop();
            if(currenElement && !currenElement.getIsCheckout()){
                this.outputSameTypeElement(currenElement,signArr);
            }
        }
    }

    /**
     * 获取元素 周边元素
     */
    private getElementAllDirs(element){
        let curElementId = element.getElementData().ID;
        let upID = (curElementId - GameData.COL_NUM) < 0?  null:(curElementId - GameData.COL_NUM);
        let bottomID = (curElementId + GameData.COL_NUM) > (GameData.ROW_NUM * GameData.COL_NUM -1)?null:(curElementId + GameData.COL_NUM);
        let leftID = this.checkoutIsBorder(element,ElementBorderDir.left) ? null:curElementId - 1;
        let rightID = this.checkoutIsBorder(element,ElementBorderDir.right) ? null:curElementId + 1;
        let list = [upID,bottomID,leftID,rightID];
        return list;
    }

    //检测上下左右方向是否有相同类型
    private checkoutDirIsSameType(element:GameElementView,cf=null,ct=null){
        let list = this.getElementAllDirs(element);
        element.setBorderUponRecord([]);
        return list.map((id,i)=>{
            let dirElement = this.getElement(id);
            if(dirElement){
                let boo = this.checkoutTypeIsEquality(element,dirElement);
                let cfBoo = (cf && ct) ? cf.call(ct,dirElement):true;
                
                if(boo && cfBoo)this.setElementBorderUponRecord(element,i+1);
               
                if(!dirElement.getIsCheckout() && boo && cfBoo){
                    return dirElement;
                }
            }
        })
    }

    /**
     * 更变总分数
     * type 1.普通融合积分增长  2.50分融合积分增长 
     */
    private changeTotalScore(type,num){
        if(type == 1){
            GameData.TOTAL_SCORE += num;
        }else if(type == 2){
            let value = GameData.baseScore;
            while(num >3){
                value = Math.round(value * 1.2);
                num--;
            }
            GameData.TOTAL_SCORE += value;
        }
        ControlManager.getInstance().applyFunc(GameEvent.totalScoreChange,GameData.TOTAL_SCORE);
    }

    /**
     * 检测元素是否为边界元素
     * @param element 检测元素
     * @param dir 方向 
     */
    private checkoutIsBorder(element,dir)
    {
        if(dir == ElementBorderDir.left){
             return element.getElementData().ID % GameData.ROW_NUM == 0;
        }else if(dir == ElementBorderDir.right){
            return element.getElementData().ID % GameData.ROW_NUM == 5;
        }else{
            return false;
        }
    }

    /**
     * 设置相邻元素
     */
    private setElementBorderUponRecord(element,position)
    {
        if(this.checkoutIsBorder(element,ElementBorderDir.left)){
             //左侧边
            if(position != ElementBorderDir.left){
                 element.getBorderUponRecord().push(position);
            }
        }else if(this.checkoutIsBorder(element,ElementBorderDir.right)){
             //右侧
           if(position != ElementBorderDir.right){
                element.getBorderUponRecord().push(position);
           }
        }else{
              element.getBorderUponRecord().push(position);
        }
    }

    /**
     * 闪电处理逻辑
     */
    public flashHandler(){
       
            if(this._activateElementList.length == 0){
                this.relieveAllFuse();
                this._currenGameState = GameState.flash;
            }else{
                this.activateAllFuse();
                this._currenGameState = GameState.normal;
            }
    }

    /**
     * 解除所有的融合
     */
    public relieveAllFuse(){
        this._activateElementList = [];
        for(let i=0; i<this._canFuseElementList.length; i++){
            let elements = this._canFuseElementList[i];
            elements.forEach(element => {
                let borderUponRecord = element.getBorderUponRecord().slice();
                this._activateElementList.push({element,borderUponRecord});
                element.setBorderUponRecord([]);
                element.showBorder(false);
            });
        }
    }

    /**
     * 恢复所有的融合
     */
    public activateAllFuse(){
        for(let obj of this._activateElementList){
            let borderUponRecord = obj.borderUponRecord;
            let element = obj.element;
            element.setBorderUponRecord(borderUponRecord);
            element.showBorder(false);
        }
        this._activateElementList = [];
    }

    //检测2个elementView的类型是否相等
    public checkoutTypeIsEquality(element1:GameElementView,element2:GameElementView)
    {
        let isBoo =  element1.getElementData().type == element2.getElementData().type;
        return isBoo;
    }

    /**
     * 删除元素 *基于元素组
     * @param id 元素索引
     */
    private delectElement(id){
       for(let i=0; i<this.elements.length; i++){
            let eId = this.elements[i].getElementData().ID;
            if(id == eId){
                this.elements.splice(i,1);
            }
        }
    }

    /**
     * 获取元素 *基于元素组
     * @param index 
     */
    public getElement(id)
    {
        for(let element of this.elements){
            let eId = element.getElementData().ID;
            if(id == eId){
                return element;
            }
        }
        return null;
    }

    /**
     * 基于对象池创建元素
     */
    public createElementByPool()
    {
        if(this._elementsPool.length > 0){
            return this._elementsPool.pop();
        }else{
            console.log("元素池 已经空了")
        }
    }

    /**
     * 对象池回收元素
     */
    public removeElementByPool(element)
    {
        if(this._elementsPool){
            element.reset();
            this._elementsPool.push(element);
        }
    }

    public get elements(){
        return this._elements;
    }
}