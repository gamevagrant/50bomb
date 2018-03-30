class GameElementView extends egret.DisplayObjectContainer
{
    private _elementData:GameElement;
    private _spIcon:egret.Bitmap;
    private _xp:number = 2;
    private _color;
    private _dirShapeList;
    private _integralLabel:egret.TextField;
    private _oldIntegral;
    public constructor()
    {
        super();
        this.width = GameData.ELEMENT_WIDTH;
        this.height = GameData.ELEMENT_HEIGHT;
        this._dirShapeList = [];
        this._oldIntegral = 1;
        this.initView();
    }

    public initView(){
        this._integralLabel = new egret.TextField();
        this._integralLabel.y = 25;
        this._integralLabel.size = 40;
        
        this.addChild(this._integralLabel);
    }

    public setElementData(data){
        this._elementData = data;
        this.renderView();
    }

    private renderView()
    {
        this._integralLabel.textColor = GameData.typeColors[this._elementData.type - 1];
        this.initMainRect();
        this.initDirShape();
        this._integralLabel.text =  this._elementData.integral > 1? this._elementData.integral + "" : "";
        this._integralLabel.x = (GameData.ELEMENT_WIDTH - this._integralLabel.textWidth) >> 1;
    }

    public updateIntegralView(oldIntegral,time)
    {
        if(oldIntegral + 1 <= this._elementData.integral){
            oldIntegral++;
            this._integralLabel.text = oldIntegral + "";
            this._integralLabel.x = (GameData.ELEMENT_WIDTH - this._integralLabel.textWidth) >> 1;
            egret.setTimeout(()=>{
                time = time - 20;
                this.updateIntegralView(oldIntegral,time);
            },this,time);
        }
    }

    public renderIntegralLabel(){
        this.updateIntegralView(this._oldIntegral,50);
        this._oldIntegral = this._elementData.integral;
    }

    /**
     * 升级
     */
    public checkoutUpgradeElement(){
        if(this._elementData.type == GameData.upgradeType)return;
        if(this._elementData.integral >= 50){
             this._elementData.type = GameData.upgradeType;
             this.setBorderUponRecord([]);
             App.SoundManager.playEffect("m50_sound_mp3"); 
             egret.Tween.get(this._spIcon).to({rotation:360},300).call(()=>{
                 this.renderView();
                 this.showBorder();
             });
        }
    }

    private initDirShape(){
        for(let i=1; i<=4; i++)
            {
                let index = i-1;
                if(this._dirShapeList[index]){
                    let dirshape = this._dirShapeList.splice(index,1,null);
                    if(dirshape.parent){
                        dirshape.parent.removeChild(dirshape);
                    }
                }
                let sp = this.createDirShape(i);
                this._dirShapeList[index] = sp;
            }
    }

    private initMainRect()
    { 
        if(!this._spIcon){
            this._spIcon = new egret.Bitmap();
             this.addChildAt(this._spIcon,0);
        }
        this._spIcon.texture = RES.getRes(`elementIcon${this._elementData.type}_png`);
        this._spIcon.anchorOffsetX = this._spIcon.width >> 1;
        this._spIcon.anchorOffsetY = this._spIcon.height >> 1;
        this._spIcon.x = this._spIcon.width / 2 + this._xp;
        this._spIcon.y = this._spIcon.height / 2 + this._xp;
    }


    //显示基于方向的Shape   * 1上 2下 3左 4右边
    private createDirShape(dir)
    {
        let sp:egret.Bitmap = new egret.Bitmap();
        sp.texture = RES.getRes(`elementRim${this._elementData.type}_png`);
        sp.anchorOffsetX = sp.width >> 1;
        sp.anchorOffsetY = sp.height >> 1;
        switch(dir)
        {
            case ElementBorderDir.up:
                sp.x = 42;
                sp.y = 12;
                break;
            case ElementBorderDir.bottom:
                sp.x = 42;
                sp.y = 72;
                sp.rotation = 180;
                break;
            case ElementBorderDir.left:
                sp.x = 12;
                sp.y = 42;
                sp.rotation = -90;
                break;
            case ElementBorderDir.right:
                sp.x = 72;
                sp.y = 42;
                sp.rotation = 90;
                break;
        }
        return sp;
    }

    public resetBorder(isTween=false){
        for(let i=0; i<this._dirShapeList.length; i++){
             let border = this._dirShapeList[i];
             if(border && border.parent){
                 let dir = i + 1;
                 if(this._elementData.borderUponRecord.indexOf(dir) == -1){
                     if(isTween){
                          egret.Tween.get(border).to({alpha:0},GameData.elementTweenShowTime).call(()=>{
                          if(border.parent)border.parent.removeChild(border);
                        },this);
                     }else{
                         if(border.parent)border.parent.removeChild(border);
                     }
                 }
             }
        }
        
    }

    public showBorder(isTween=true)
    {
            for(let i=0; i<this._dirShapeList.length; i++){
                let borderView = this._dirShapeList[i];
                let dir = i+1;
                if(this._elementData.borderUponRecord.indexOf(dir) != -1){
                    if(!borderView.parent){
                        this.addChildAt(borderView,0);
                        if(isTween){
                            borderView.alpha = 0;
                            egret.Tween.get(borderView).to({alpha:1},GameData.elementTweenShowTime).call(()=>{
                            });
                        }else{
                            borderView.alpha = 1;
                        }
                    }
                }else{
                    if(borderView.parent){
                        if(isTween){
                             borderView.alpha = 1;
                                egret.Tween.get(borderView).to({alpha:0},GameData.elementTweenShowTime).call(()=>{
                                borderView.parent.removeChild(borderView);
                            });
                        }else{
                            borderView.parent.removeChild(borderView);
                        }
                       
                    }
                }
            }
    }

    public hideBorder()
    {
        this.setBorderUponRecord([]);
        this.showBorder(false);
    }

    public getElementData():GameElement
    {
        return this._elementData;
    }

    public getIsCheckout()
    {
        return this._elementData.isCheckout;
    }

    public setIsCheckout(boo)
    {
        this._elementData.isCheckout = boo;
    }

    public setElementDataId(id){
        this._elementData.ID = id;

    }

    public setBorderUponRecord(array){
        this._elementData.borderUponRecord = array;
    }

    public getBorderUponRecord()
    {
        return this._elementData.borderUponRecord;
    }

    /**
     * 获取元素位置 {row,col}
     */
    public getElementPosition()
    {
        let row = ~~(this._elementData.ID / GameData.ROW_NUM);
        let col = this._elementData.ID % GameData.COL_NUM;
        return {row,col};
    }

    /**
     * 获取元素 {x,y}
     */
    public getElementLocationXY(){
        let position = this.getElementPosition();
        let x = position["col"] * this.width;
        let y = position["row"] * this.height;
        return {x,y};
    }

    public get integral(){
        return this._elementData.integral;
    }

    public addIntegral(value){
        if(this._elementData.integral < 50){
            this._elementData.integral += value;
        }
        if(this._elementData.integral >= 50){
            this._elementData.integral = 50;
        }
    }

    public reset(){
        this._oldIntegral = 1;
        this._elementData.reset();
        if(this._integralLabel){
            this._integralLabel.text = "";
        }
        for(let i=0;i<this._dirShapeList.length; i++){
            let shape = this._dirShapeList[i];
            if(shape && shape.parent){
                shape.parent.removeChild(shape);
            }
        }
    }

    public set type(value){
        if(this._elementData.type != value){
            this._elementData.type = value;
            this.renderView();  
        }
    }
}