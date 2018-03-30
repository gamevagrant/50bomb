class RankItemRenderer extends eui.ItemRenderer
{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/RankItemRendererSkin.exml";
    }

    public bgRect:eui.Rect;
    public scoreLabel:eui.Label;
    public rankImg:eui.Image;
    public rankLabel:eui.Label;
    public headImg:eui.Image;
    public nameLabel:eui.Label;
    public maskImg:eui.Rect;
    protected dataChanged(){
        if(this.data.Ranking % 2 == 0){
            this.bgRect.fillColor = 0xffffff;

        }else{
            this.bgRect.fillColor = 0xebf5fe;
        }

        if(this.data.Ranking <= 3){
            this.rankLabel.text = "";
            this.rankImg.visible = true;
            this.rankImg.source = `icon_${this.data.Ranking}_png`
        }else{
            this.rankImg.visible = false;
            this.rankLabel.text = this.data.Ranking;
        }

        this.setUserHeadImg();
        this.nameLabel.text = this.data.UserName + "";
        this.scoreLabel.text = this.data.MaxScore + "";
        
    }

    private setUserHeadImg(){
        this.headImg.texture = null;
        this.headImg.mask = this.maskImg;
        let userImgURL = this.data.UserImgURL;
        if(userImgURL && userImgURL != "null" && userImgURL != "/0" && userImgURL.length > 10){
            let url = "http://h5.dodgame.com.cn/api/getimg?url=" + userImgURL;
            App.ResourceUtils.loadImg(url,(texture)=>{
                if(texture){
                    this.headImg.texture = texture;
                  }
            },this);
        }else{
            this.headImg.texture = RES.getRes("youkeHeadImg_png");
        }
    }
}