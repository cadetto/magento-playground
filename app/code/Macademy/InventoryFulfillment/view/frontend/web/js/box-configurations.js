define([
    'uiComponent',
    'ko',
    'Macademy_InventoryFulfillment/js/model/box-configurations',
    'Macademy_InventoryFulfillment/js/model/sku',
    'jquery'
], function(
    Component,
    ko,
    boxConfigurationsModel,
    skuModel,
    $
){
    'use strict'

    return Component.extend({
        defaults:{
            boxConfigurationsModel: boxConfigurationsModel,
            skuModel: skuModel
        },
        initialize: function(){
            this._super()

            console.log('Box configurations Initialized')

            skuModel.isSuccess.subscribe((value) => {
                console.log("SKU isSuccess new value", value)
            })

            skuModel.isSuccess.subscribe((value) => {
                console.log("SKU isSuccess old value", value)
            },null, 'beforeChange')
        },
        handleAddRow(){
            boxConfigurationsModel.add()
        },
        handleDelete(index){
            // The this keyword on this function refers to the .bind call on template
            boxConfigurationsModel.delete(index)
        },
        handleSubmit(){
            $('.box-configurations form input').removeAttr('aria-invalid')
            if($('.box-configurations form').valid()){
                boxConfigurationsModel.isSuccess(true)
            } else{
                boxConfigurationsModel.isSuccess(false)
            }
            console.log(boxConfigurationsModel.isSuccess())
        }
    })
})