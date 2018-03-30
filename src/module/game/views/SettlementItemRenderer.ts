class SettlementItemRenderer extends eui.ItemRenderer
{
 	public constructor()
	{
        super();
        this.skinName = "resource/eui_skins/SettlementItemSkin.exml";
    }

	public nameLabel:eui.Label;
	public scoreLabel:eui.Label;
	public rankLabel:eui.Label;
	public headImg:eui.Image;
	public maskImg:eui.Rect;

	protected dataChanged(){

        egret.log("更新数据 "+this.data);
        this.setUserHeadImg(this.data.photo);
        this.nameLabel.text = this.data.name + "";
        this.scoreLabel.text = this.data.score + "";
        this.rankLabel.text = this.data.rank + "";
    }

    private setUserHeadImg(url:string){
        this.headImg.texture = null;
        this.headImg.mask = this.maskImg;
        let userImgURL = url;
        if(userImgURL && userImgURL != "null" && userImgURL != "/0" && userImgURL.length > 10)
		{
            let url = userImgURL;
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