class GameElement
{
    public type:number;
    public ID:number;
    public isCheckout:boolean;//是否检测过 
    public borderUponRecord:Array<number>;//相邻方块记录  1.上 2.下 3.左 4.右
    public integral:number; //初始积分

    public reset()
    {
        this.type = -1;
        this.ID = -1;
        this.isCheckout = false;
        this.borderUponRecord = [];
        this.integral = GameData.integral;
    }
}
//元素边框方向
enum ElementBorderDir{
    up = 1,
    bottom,
    left,
    right
}