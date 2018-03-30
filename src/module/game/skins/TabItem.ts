class TabItem extends eui.ItemRenderer
{
    public constructor(){
        super();
        this.skinName = "resource/eui_skins/TabBarButtonSkin.exml"
    }

    public mydata;
    public iconDisplay;
    public labelDisplay;
    public upImg:eui.Image;
    public downImg:eui.Image;
    public set data(value:any) {
        if (this.iconDisplay) {
            // this.iconDisplay.source = this.data.title;
        }
        if (this.labelDisplay) {
            this.labelDisplay.text = value.name;
            this.labelDisplay.bold = true;
        }

        if(this.upImg){
            this.upImg.source = value.upImg;
        }

        if(this.downImg){
            this.downImg.source = value.downImg;
        }
    }

    public get data():any {
        return this.mydata;
    }
}