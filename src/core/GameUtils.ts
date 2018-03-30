/**
 * Created by Administrator on 2016/8/23.
 */
class GameUtils
{
    public static showLoadWait()
    {
        ViewManager.getInstance().open(GameContainer.UI_TIP_TYPE,"LoadWaitLayer");
    }

    public static hideLoadWait()
    {
        ViewManager.getInstance().closeView("LoadWaitLayer");
    }

    /**
     * 打开确认弹窗
     */
    public static showConfirmLayer(text,cf=null,ct=null,type=1){
        ViewManager.getInstance().open(GameContainer.UI_BOX_TYPE,"ConfirmLayer",text,cf,ct,type);
    }

    /**
     * 打开平台分享
     */
    public static openPlatformShare(){
        let post_data:any = {};
        post_data.is_debug = false; // 是否调试模式
        post_data.info_type = "msg_share"; // 消息类型
        window.parent.postMessage(post_data, '*');
    }

    /**
     * 检测星星 是否足够 
     * @param num 
     */
    public static checkoutStarEnough(num){
        if(GameUtils.getResidueFlash() >= num && num != 0){
            return true;
        }
        return false;
    }


    public static getResidueFlash(){
        return ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["ResidueFlash"] || 0;
    }

    public static getFlashPrice(){
        return ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["FlashPrice"] || 0;
    }

    public static getLastScore(){
        return ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["LastScore"] || 0;
    }

    public static getLastEarnedFlash(){
        return ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["LastEarnedFlash"] || 0;
    }

    //是否为新纪录新纪录为新纪录新纪录
    public static isNewRecord(){
        let maxScore = ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["MaxScore"] || 0;
        return GameData.TOTAL_SCORE > maxScore;
    }

    public static gameWidth(){
        return egret.MainContext.instance.stage.stageWidth;
    }

    public static gameHeight(){
        return egret.MainContext.instance.stage.stageHeight;
    }

    public static updateResidueFlash(num){
        ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["ResidueFlash"] = num;
        ControlManager.getInstance().applyFunc(GameEvent.updateFlash);
    }

    public static userLogin(){
        let post_data:any = {};
        post_data.is_debug = false; // 是否调试模式
        post_data.info_type = "msg_auth_verify_fail"; // 消息类型
        post_data.info_data = {}; // 数据内容
        window.parent.postMessage(post_data, '*');
    }

    public static refreshShareInfo(){
        let post_data:any = {};
        post_data.is_debug = false; // 是否调试模式
        post_data.info_type = "msg_share_refresh_data"; // 消息类型
        post_data.info_data = {
            "share_title":"5050",
            "share_desc":"超好玩的消除游戏，智力与策略的比拼！",
            "img_url":"http://h5.dodgame.com.cn/wx/50bomb/50bomb.png"
        }; // 数据内容
        window.parent.postMessage(post_data, '*');
    }

    public static followSubscribe(){
        let post_data:any = {};
        post_data.is_debug = false; // 是否调试模式
        post_data.info_type = "msg_follow_subscribe"; // 消息类型
        post_data.info_data = {}; // 数据内容
        window.parent.postMessage(post_data, '*');
    }

    private static _gameSearch = "";

    public static setGameSearch(url){
        this._gameSearch = url;
    }

    public static getGameUrlSearch(){
        return this._gameSearch;
    }

    public static isNewUser(){
        let maxScore = ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["MaxScore"];
        let lastScore = ProxyManager.getCache(HttpConst.getUserInfo)["Value"]["LastScore"];
        let pastModel = ProxyManager.getCache(HttpConst.loadMapData)["Model"];
        if(!maxScore && !lastScore && (!pastModel || pastModel.length <= 0)){
            return true;
        }else{
            return false;
        }
    }
}