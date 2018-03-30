/**
 * Created by Administrator on 2016/8/19.
 */
class App
{
    
    /**
     * 统一的计时器和帧刷管理类
     * @type {TimerManager}
     */
    public static get TimerManager():TimerManager{
        return TimerManager.getInstance();
    }

    /**
     * 音乐管理类
     */
    public static get SoundManager():SoundManager{
        return SoundManager.getInstance();
    }

    /**
     * Stage操作相关工具类
     */
    public static get StageUtils():StageUtils{
        return StageUtils.getInstance();
    }

    /**
     * 资源加载工具类
     */
    public static get ResourceUtils():ResourceUtils{
        return ResourceUtils.getInstance();
    }

    /**
     * 显示对象工具类
     * @type {DisplayUtils}
     */
    public static get DisplayUtils():DisplayUtils{
        return DisplayUtils.getInstance();
    }

    //全局消息管理
    public static get ControlManager():ControlManager{
        return ControlManager.getInstance();
    }

    /**
     * 服务器返回的消息处理中心
     * @type {MessageCenter}
     */
    public static get MessageCenter():MessageCenter{
        return MessageCenter.getInstance(1);
    }

    public static get RandomUtils():RandomUtils{
        return RandomUtils.getInstance();
    }

    public static get ArrayUtils():ArrayUtils{
        return ArrayUtils.getInstance();
    }

    public static get HTTP():Http
    {
        return Http.getInstance();
    }

    public static get HttpManager():HttpManager{
        return HttpManager.getInstance();
    }

    public static get Base64():Base64{
        return Base64.getInstance();
    }
}
