class ErrorManager extends BaseClass{
    public init(){
        ControlManager.getInstance().on(GameErrorEvent.gameSendError,this.onGameSendErrorHandler,this);
    }

     private onGameSendErrorHandler(errorId){
        let errorText = RES.getRes("errorData_json")[errorId];
        if(errorText){
            GameUtils.showConfirmLayer(errorText,()=>{

            },this,0);
        }
    }
}