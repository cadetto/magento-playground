define(['uiComponent'], function( Component ){
    'use strict'
    return Component.extend({

        initialize: function(){
            this._super()
            console.log("Im inside of a uicomponent in adminhtml")
        },

        defaults:{
            message: "This is a testing message",
            template: "LogosCorp_OrdersUiComponent/sales/order/payment"
        }
    })
})