var EquipmentModel = Backbone.Model.extend({
    defaults:function(){
        return {
            level: 1,
            type:"",
            subtype:""
            requirements:null,
            skills:[]
        }
    }
});
