define([
    'uiComponent',
    'ko',
    'mage/storage',
    'jquery',
    'mage/translate',
    'Macademy_InventoryFulfillment/js/model/sku'
], function( Component , ko, storage, $, $t, skuModel){
    'use strict'

    return Component.extend({
        defaults: {
            sku: skuModel.sku,
            placeholder: $t('Example:') + " " + '24-MB01',
            messageResponse: ko.observable(""),
            isSuccess: skuModel.isSuccess
        },

        initialize: function(){
            this._super()

            console.log("I'm being called from an Ui Component")
        },

        handleSubmit: function(){
            $('body').trigger('processStart')
            this.messageResponse("")
            this.isSuccess(false) 
            storage.get(`rest/V1/products/${this.sku()}`)
                .done( response => {
                    this.messageResponse($t('Product found! %1').replace('%1', `<strong>${response.name}</strong>`))
                    this.isSuccess(true)
                })
                .fail(() => {
                    this.messageResponse($t('The product was not found'))
                    this.isSuccess(false)
                })
                .always(() => {
                    $('body').trigger('processStop')
                })
        }
    })
})