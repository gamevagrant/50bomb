class GameEvent
{
    //元素创建完成
    public static elementCreateComplete:string = "elementCreateComplete";
    //元素点击事件
    public static elementTouchTap:string = "elementTouchTap";
    //总积分更变
    public static totalScoreChange:string = "totalScoreChange";
    //闪电道具使用
    public static flashComplete:string = "flashComplete";
    //更新星星
    public static updateFlash:string = "updateFlash";
    //更新分享提示
    public static updateShareTip:string = "updateShareTip";
    //分享
    public static shareMessage:string = "shareMessage";
}

class GameErrorEvent{
    public static gameError:string = "gameError";
    public static gameSendError:string = "gameSendError";
}