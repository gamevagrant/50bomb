class SettlementLayer extends BaseEuiView
{
	public constructor() {
		super();
        this.skinName = "resource/eui_skins/SettlementLayerSkin.exml";
	}

	public rankList:eui.List;
	public friendsList:eui.List;
	public inviteBtn:eui.Button;
	public playBtn:eui.Button;

	private rankArrayCollection:eui.ArrayCollection;
	private friendsArrayCollection:eui.ArrayCollection;
	
	public openView()
	{
		App.DisplayUtils.registerBtn(this.inviteBtn,this.onInviteFriendsHandle,this);
		App.DisplayUtils.registerBtn(this.playBtn,this.onPlayNowHandle,this);

		this.friendsList.itemRenderer = FriendItemRenderer;
		this.friendsArrayCollection = new eui.ArrayCollection();
		this.friendsList.dataProvider = this.friendsArrayCollection;

		this.rankList.itemRenderer = SettlementItemRenderer;
		this.rankArrayCollection = new eui.ArrayCollection();
		this.rankList.dataProvider = this.rankArrayCollection;

		//获取排行榜
		egretfb.EgretFBInstant.getLeaderboardAsync("TotalLeaderBoard."+ egretfb.EgretFBInstant.context.getID())
		.then((leaderboard)=>{

			leaderboard.setScoreAsync(30);
			return leaderboard.getEntriesAsync();

		})
		.then((entries)=>{
			
			this.rankList.height = entries.length * 150;
			egret.log("数据长度 "+entries.length.toString());

			entries.forEach(element=>{
				
				var rankData:RankData = new RankData();
				rankData.name = element.getPlayer().getName();
				rankData.photo = element.getPlayer().getPhoto();
				rankData.id = element.getPlayer().getID();
				rankData.score = element.getScore();
				rankData.rank = element.getRank();
				egret.log("用户 "+rankData.name);
				this.rankArrayCollection.addItem(rankData);
				
			});

			
		});


		//获取好友信息
		egretfb.EgretFBInstant.player.getConnectedPlayersAsync()
		.then(players=>{
			this.friendsList.height = players.length * 150
			egret.log("好友数量 "+players.length.toString());
			players.forEach(element=>{
				var friendData:RankData = new RankData();
				friendData.id = element.getID();
				friendData.name = element.getName();
				friendData.photo = element.getPhoto();
				egret.log("friend:"+friendData.name);
				this.friendsArrayCollection.addItem(friendData);
			});
		});
		
	}

	private onInviteFriendsHandle()
	{
		egretfb.EgretFBInstant.context.chooseAsync();
	}

	private onPlayNowHandle()
	{
		egret.log("onPlayNowHandle ");

		RgDot.onEvent("game",{"restartGame":1});
		GameData.TOTAL_SCORE = 0;
		GameData.initData();
		ViewManager.getInstance().closeView("SettlementLayer");
		GameControl.getInstance().startGame();
	}
}

class RankData
{
	public photo:string;
	public name:string;
	public score:number;
	public rank:number;
	public id:string;
}