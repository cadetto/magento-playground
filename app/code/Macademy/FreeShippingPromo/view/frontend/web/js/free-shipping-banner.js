define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'underscore',
    'knockout'
], function( Component, customerData, _ , ko ){
    'use strict';
    return  Component.extend({

        defaults: {
            subtotal: 0.00,
            freeShippingThreshold: 100,
            template: "Macademy_FreeShippingPromo/free-shipping-banner",
            tracks: {
                subtotal: true,
            }
        },

        initialize: function(){
            this._super();
            var cart = customerData.get('cart');
            var that = this;
            customerData.getInitCustomerData().done(function(){
                if(!_.isEmpty(cart()) && !_.isUndefined(cart().subtotalAmount) ){
                    that.subtotal = parseFloat(cart().subtotalAmount)
                }
            });

            cart.subscribe(function(cart){
                if(!_.isEmpty(cart) && !_.isUndefined(cart.subtotalAmount) ){
                    that.subtotal = parseFloat(cart.subtotalAmount)
                }
            })

            that.message = ko.computed(function(){
                if(_.isUndefined(that.subtotal) || that.subtotal === 0 ){
                    return that.messageDefault;
                }
                if(that.subtotal > 0 && that.subtotal < that.freeShippingThreshold){
                    var subtotalRemaining = 100 - that.subtotal
                    var formattedSubtotalRemaining = that.formatCurrency(subtotalRemaining)
                    return that.messageItemsInCart.replace('$XX.XX', formattedSubtotalRemaining);
                }
                if(that.subtotal >= that.freeShippingThreshold){
                    return that.messageFreeShipping;
                }
            }) 
        },

        formatCurrency: function(value){
            return '$' + value.toFixed(2)
        }
    });
})
