class ArrayUtils extends BaseClass
{
    public removeDuplicatedItem(arr) {
        var tmp = {},
            ret = [];

        for (var i = 0, j = arr.length; i < j; i++) {
            if (!tmp[arr[i]]) {
                tmp[arr[i]] = 1;
                ret.push(arr[i]);
            }
        }
        return ret;
    }
}