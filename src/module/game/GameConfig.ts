/**
 * Created by Administrator on 2016/12/5.
 */
class GameConfig
{
    private static mapData:any;
    private static gameData:any;
    public static initConfig()
    {
        GameConfig.mapData = RES.getRes("mapData_json");
    }
    //地图数据
    public static getMapDataById(id:number)
    {
        return GameConfig.mapData[id];
    }
}