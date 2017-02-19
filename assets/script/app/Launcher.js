cc.Class({
    extends: cc.Component,


    // use this for initialization
    onLoad: function () {
        DataManager.loadDatabase();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
