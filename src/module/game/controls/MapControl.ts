class MapControl extends BaseClass
{

    public initMap()
    {
        for(let i=0; i<GameData.ROW_NUM; i++)
            {
                for(let j=0; j<GameData.COL_NUM; j++)
                    {
                        let obj = GameData.mapData[i][j];
                        let ID = i * GameData.COL_NUM + j;
                        let element:GameElement = new GameElement();
                        element.type = obj.t;
                        element.ID = ID;
                        element.isCheckout = false;
                        element.borderUponRecord = [];
                        element.integral = obj.i;
                        GameData.elementDatas.push(element);
                    }
            }
    }

    public resetMap(){
        GameData.elementDatas = [];
    }

}