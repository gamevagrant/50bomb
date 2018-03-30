class ProxyManager{
    private static cache = {};
    //获取用户信息
    public static getUserInfo(cf,ct){
        /*
        egret.log("getUserInfo");
        let user_name = egret.getOption("user_name");
        let user_img_url = UrlUtils.getQueryString("user_img_url");
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");

        HttpManager.sendMsg(HttpConst.getUserInfo,{is_sign_in,user_name,user_img_url}).then((data)=>{
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            egret.log("sendMsg"+data);
            if(cf && ct){
                cf.call(ct,data);
            }
        },(err)=>{
            ControlManager.getInstance().applyFunc(GameErrorEvent.gameError,HttpConst.getUserInfo);
            console.log(err);
        })
        */

        var player:egretfb.EgretFBPlayer = egretfb.EgretFBInstant.player;
        player.getStatsAsync(["MaxScore","LastScore","PlayCount"])
        .then(stats=>{
            var data = 
            {
                Value:
                {
                    UserId:player.getID(),
                    UserName:player.getName(),
                    UserImgURL:player.getPhoto(),
                    MaxScore:stats["MaxScore"],
                    LastScore:stats["LastScore"],
                    PlayCount:stats["PlayCount"],
                } 
            };
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            if(cf && ct)
            {
                cf.call(ct,data);
            }
        });
       
    }

    //使用闪电道具
    public static sendEliminateRefresh(cf,ct){
        HttpManager.sendMsg(HttpConst.eliminateFlash).then((data)=>{
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            ControlManager.getInstance().applyFunc(GameEvent.flashComplete);
            if(cf && ct){
                cf.call(ct,data);
            }
        },(err)=>{
            ControlManager.getInstance().applyFunc(GameErrorEvent.gameError,HttpConst.eliminateFlash);
            console.log(err);
        })
    }

    /**
     * 游戏结束
     * @param score 分数
     * @param cf 
     * @param ct 
     */
    public static sendGameOver(score,user_img_url,cf,ct){
        /*
        let is_sign_in = UrlUtils.getQueryString("is_sign_in");
        HttpManager.sendMsg(HttpConst.gameOver,{score,user_img_url,is_sign_in}).then((data)=>{
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            if(cf && ct){
                cf.call(ct,data);
            }
        },(err)=>{
            ControlManager.getInstance().applyFunc(GameErrorEvent.gameError,HttpConst.gameOver);
            console.log(err);
        })
        */
        var player:egretfb.EgretFBPlayer = egretfb.EgretFBInstant.player;
        
        player.setStatsAsync({
            MaxScore:Math.max(score,this.cache["Value"]["MaxScore"]),
            LastScore:score,
            PlayCount:this.cache["Value"]["PlayCount"]+1,
        })
        .then((stats)=>{
            var data = 
            {
                Value:
                {
                    UserId:player.getID(),
                    UserName:player.getName(),
                    UserImgURL:player.getPhoto(),
                    MaxScore:stats["MaxScore"],
                    LastScore:stats["LastScore"],
                    PlayCount:stats["PlayCount"],
                } 
            };
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            if(cf && ct)
            {
                cf.call(ct,data);
            }
        });
    }

    public static sendGameRefresh(cf,ct){
        /*
        HttpManager.sendMsg(HttpConst.refresh).then((data)=>{
            ProxyManager.cache[HttpConst.getUserInfo]= data;
            if(cf && ct){
                cf.call(ct,data);
            }
        },(err)=>{
            ControlManager.getInstance().applyFunc(GameErrorEvent.gameError,HttpConst.refresh);
            console.log(err);
        })
        */

        if(cf && ct){
                cf.call(ct,this.cache);
            }
    }

    /**
     * 请求查询排行
     * @param type 0好友 1.世界 
     * @param from 开始
     * @param count 结束
     */
    public static sendQueryRanks(type,from,count,cf,ct){
        let httpName = type == 0?HttpConst.queryFriends:HttpConst.queryWorld;

        HttpManager.sendMsg(httpName,{from,count}).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 获取自己的排名
     * @param type 0 好友 1世界
     * @param cf 
     * @param ct 
     */
    public static sendSelfRank(type,cf,ct){
        let httpName = type == 0?HttpConst.queryUserInFriends:HttpConst.queryUserInWorld;
        
        HttpManager.sendMsg(httpName).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 查询关注奖励状态
     * @param cf 
     * @param ct 
     */
    public static sendQuerySubscribeAward(cf,ct){
        HttpManager.sendMsg(HttpConst.querySubscribeAward).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 获取关注奖励
     * @param cf 
     * @param ct 
     */
    public static sendGetSubscribeAward(cf,ct){
        HttpManager.sendMsg(HttpConst.getSubscribeAward).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 查询分享奖励
     * @param cf 
     * @param ct 
     */
    public static sendQueryShareAward(cf,ct){
        HttpManager.sendMsg(HttpConst.queryShareAward).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 获取分享奖励
     * @param cf 
     * @param ct 
     */
    public static sendGetShareAward(cf,ct){
        HttpManager.sendMsg(HttpConst.getShareAward).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 保存游戏数据
     * @param model 
     * @param cf 
     * @param ct 
     */
    public static sendSaveMapData(model,cf,ct){
        HttpManager.sendMsg(HttpConst.saveMapData,{model}).then((data)=>{
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    /**
     * 加载地图数据
    * @param cf 
     * @param ct 
     */
    public static sendLoadMapData(cf,ct){
        HttpManager.sendMsg(HttpConst.loadMapData).then((data)=>{
            ProxyManager.cache[HttpConst.loadMapData] = data;
            if(cf && ct){
                cf.call(ct,data);
            }
        })
    }

    



    public static getCache(httpName){
        var c = ProxyManager.cache;
        if(ProxyManager.cache[httpName]){
            return ProxyManager.cache[httpName];
        }else{
            console.log(`没有${httpName}的缓存`);
        }
    }
}