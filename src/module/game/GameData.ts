class GameData {
    public static ELEMENT_WIDTH:number = 84; //元素宽
    public static ELEMENT_HEIGHT:number = 84;//元素高
    public static ELEMENT_TOTAL_NUM:number = 0;//元素总数量
    public static ROW_NUM : number = 0; //最大的行
    public static COL_NUM : number = 0; //最大的列
    public static curLevel:number = 0;//当前关卡
    public static mapData;//当前地图数据
    public static elementDatas;//元素数据池
    public static elementTweenShowTime = 150;//元素缓动展示时间
    public static createTypeRange = [1,2,3];//生产类型的范围
    public static upgradeScore:number = 50;//升级的分数
    public static upgradeType:number = 4;//升级的类型
    public static integral:number = 1;//初始分数
    public static TOTAL_SCORE:number = 0;//总分数
    public static baseScore:number = 500;//基础分值 用于type4元素的消除 积分计算
    public static typeColors = [0x8f743d,0x884146,0x3f5b6b,0xffffff];
    public static initData(){
        
        let loadMapData = ProxyManager.getCache(HttpConst.loadMapData)["Model"];
        let mapInfo;
        if(loadMapData && loadMapData.length > 0){
            RgDot.onEvent("loadMapInfo",{"state":"true"});
            mapInfo = JSON.parse(loadMapData); 
        }else{
            if(GameUtils.isNewUser()){
                mapInfo = GameConfig.getMapDataById(1);
            }else{
                mapInfo = GameConfig.getMapDataById(2);
            }
        }
         GameData.mapData = mapInfo.map;
         GameData.TOTAL_SCORE = mapInfo.score;
         GameData.ROW_NUM = GameData.mapData.length;
         GameData.COL_NUM = GameData.mapData[0].length;
         GameData.ELEMENT_TOTAL_NUM = GameData.ROW_NUM * GameData.COL_NUM;
         GameData.elementDatas = new Array();
     }

     /**
      * 获取随机类型
      */
     public static getRandomType()
     {
         let max = GameData.createTypeRange.length;
         return Math.floor(Math.random()*max) + 1;
     }
}

enum GameState{
    normal=0,                          //正常状态
    flash                              //闪电道具状态
}