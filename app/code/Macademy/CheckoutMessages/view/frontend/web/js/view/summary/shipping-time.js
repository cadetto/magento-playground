define(['uiComponent'], function(Component){
    'use strict'

    return Component.extend({
        initialize: function(){
            this._super()

            console.log(this.name, "is initialized")
        },
        defaults:{

            tracks: {
                countryId: true
            },

            imports: {
                countryId: 'checkoutProvider:shippingAddress.country_id'
            },

            // como el imports de arriba pero alreves, permite llamar funciones
            // muy util para debug y otras cosas
            listens: {
                //el provider esta definido en el xml con el valor checkoutProvider:shippingAddress
                '${ $.shippingAddressProvider }.region_id': 'handleRegionChange'
            },


            showMessage: function(){
                return this.countryId === 'US'
            },

            handleRegionChange: function(newRegionId){
                // console.log("The new region is ", newRegionId)
            },

        }
    })
})