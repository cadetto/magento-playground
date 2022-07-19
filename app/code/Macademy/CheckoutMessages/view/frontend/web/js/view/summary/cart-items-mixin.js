define([], function(){
    'use strict'

    return function(Component){
        return Component.extend({

            defaults:{
                template: "Macademy_CheckoutMessages/summary/cart-items",

                // !EVITAR USO DE EXPORTS
                //la variable total.subtotal viene del archivo original en el modulo magento checkout
                //este archivo es solo un mixin, se mergea con el original en el vendor
                exports: {
                    //exporto la variable de este uicomponent a otro uicomponent, en su variable "subtotal"
                    //La variable subtotal no necesriamente tiene que estar definida en checkout.sidebar.guarantee
                    'totals.subtotal': 'checkout.sidebar.guarantee:subtotal'
                }
            },

            isItemsBlockExpanded: function(){
                return true
            }
        })
    }
})