define(['uiComponent'], function(Component){
    'use strict'

    return Component.extend({
        showGuaranteeMessage: function(){
            //subtotal exportado de cart-items-mixins
            // !Proceso solo referencial EVITAR usar exports, no se de donde monda viene la variable subtotal
            return this.subtotal > 100 
        },
        initialize: function(){
            this._super()

            console.log(this.name, " is initialized")
        }
    })
})