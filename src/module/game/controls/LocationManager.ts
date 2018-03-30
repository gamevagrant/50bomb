class LocationManager{
    /**
     * 获取元素位置信息 {row,col}
     * @param id 元素id
     */
    public static getElementLocationById(id){
        let row = ~~(id / GameData.ROW_NUM);
        let col = id % GameData.COL_NUM;
        return {row,col};
    }

    /**
     * 获取元素XY位置获取元素XY位置
     * @param id 
     */
    public static getElementLocationXYById(id){
        let position = LocationManager.getElementLocationById(id);
        let x = position["col"] * GameData.ELEMENT_WIDTH;
        let y = position["row"] * GameData.ELEMENT_HEIGHT;
        return {x,y};
    }

    /**
     * 获取元素id 基于xy位置
     */
    public static getElementIDByLocationXY(x,y){
        let row = ~~(y / GameData.ELEMENT_HEIGHT);
        let col = ~~(x / GameData.ELEMENT_WIDTH);
        let id = Math.min(Math.max(row,0),GameData.ROW_NUM -1)  * GameData.ROW_NUM + Math.min(Math.max(col,0),GameData.COL_NUM - 1);
        return id;
    }

    /**
     * 获取一圈元素id  八个元素 (上-1 上 上+1 左 右 下-1 下 下+1) 
     * @param id 
     * @param num 圈数 1圈or2圈 （不支持大于2圈）
     */
    public static getOnecircleElementIdsById(id,num=1){
        if(num > 2){
            console.error("不支持大于2圈");
            return;
        }
        let eID = id;
        let allDirs = function(id){
            if(id == -1)return {all:[],angulus:[]};
            let allDirElements = this.getAllDirElementIdsById(id,1);
            let upId = allDirElements[ElementBorderDir.up -1];
            let upList = this.getAllDirElementIdsById(upId,1,2);
            let bottomId = allDirElements[ElementBorderDir.bottom -1];
            let bottomList = this.getAllDirElementIdsById(bottomId,1,2);
            return {all:[...allDirElements,...upList,...bottomList],angulus:[...upList,...bottomList]};
        }.bind(this);

        if(num == 1){
            return allDirs(id).all;
        }else{
            let elements = allDirs(id);
            let alls = elements.all;
            let list = [];
            let angulus = elements.angulus;
            angulus.forEach(id => {
                let all = allDirs(id).all;
                list.push(...all);
            });
            let results = App.ArrayUtils.removeDuplicatedItem([...list,...alls]);
            let index = results.indexOf(eID);
            if( index != -1){
                results.splice(index,1);
            }
            return results;
        }
    }

    /**
     * 获取元素 上下左右元素id
     * @param id 
     * @param num 圈数 
     * @param type 1 (上下左右元素) 2(左右) 
     * 
     */
    public static getAllDirElementIdsById(id,num=1,type=1){
        if(id == -1)return [];
        let multiple = GameData.COL_NUM * num;
        
        let leftID = this.checkoutIsBorder(id,ElementBorderDir.left) ? -1:id - num;
        let rightID = this.checkoutIsBorder(id,ElementBorderDir.right) ? -1:id + num;
        
        if(type == 2){
            return [leftID,rightID];
        }else if(type == 1){
            let upID = (id - multiple) < 0?  -1:(id - multiple);
            let bottomID = (id + multiple) > (GameData.ELEMENT_TOTAL_NUM -1)?-1:(id + multiple);
            return  [upID,bottomID,leftID,rightID];
        }
    }

    /**
     * 检测是否为 左/右 边界
     * @param id 
     * @param dir  
     */
    public static checkoutIsBorder(id,dir)
    {
        if(dir == ElementBorderDir.left){
             return id % GameData.ROW_NUM == 0;
        }else if(dir == ElementBorderDir.right){
            return id % GameData.ROW_NUM == 5;
        }else{
            return false;
        }
    }

}