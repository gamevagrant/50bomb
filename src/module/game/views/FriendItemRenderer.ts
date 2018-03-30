class FriendItemRenderer extends eui.ItemRenderer
{
	 public constructor(){
        super();
        this.skinName = "resource/eui_skins/FriendItemSkin.exml";
    }

	public nameLabel:eui.Label;
	public headImg:eui.Image;
	public maskImg:eui.Rect;
	public playBtn:eui.Button;

	protected dataChanged(){

        egret.log("friend更新数据 "+this.data);
        this.setUserHeadImg(this.data.photo);
        this.nameLabel.text = this.data.name + "";
		App.DisplayUtils.registerBtn(this.playBtn,this.playWithFriend,this);
    }

    private setUserHeadImg(url:string){
		egret.log("setUserHeadImg "+this.data);
        this.headImg.texture = null;
        this.headImg.mask = this.maskImg;
        let userImgURL = url;
		egret.log("load "+this.data);
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

	private playWithFriend()
	{
		egretfb.EgretFBInstant.context.createAsync(this.data.id);
	}
}