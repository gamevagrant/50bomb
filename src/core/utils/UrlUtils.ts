class UrlUtils extends BaseClass {
    public static getQueryString(name) : string {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = GameUtils.getGameUrlSearch().substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    public static getCookie(key) {
        var arr;
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return arr[2];
        else
          return null;
      }
}