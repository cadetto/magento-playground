define([
    'uiComponent',
    'ko',
    'Macademy_InventoryFulfillment/js/model/box-configurations',
    'Macademy_InventoryFulfillment/js/model/sku',
    'mage/url',
    'mage/storage'
], function(
    Component,
    ko,
    boxConfigurationsModel,
    skuModel,
    url,
    storage
){

    return Component.extend({
        defaults:{
            numberOfBoxes: boxConfigurationsModel.numberOfBoxes(),
            billableWeight: boxConfigurationsModel.billableWeight(),
            shipmentWeight: boxConfigurationsModel.totalWeight(),
            termsAndConditions: ko.observable(false),
            boxConfigurationsIsSuccess: boxConfigurationsModel.isSuccess,
            boxConfigurations: boxConfigurationsModel.boxConfigurations,
            sku: skuModel.sku
        },
        initialize: function(){
            this._super();

            this.canSubmit = ko.computed(() => {
                return skuModel.isSuccess() && boxConfigurationsModel.isSuccess() && this.termsAndConditions()
            })
        },
        handleSubmit: function(){
            if(this.canSubmit()){
                storage
                    .post(this.getUrl(), {
                        'sku': skuModel.sku(),
                        'boxConfigurations': ko.toJSON(boxConfigurationsModel.boxConfigurations)
                    })
                    .done( response => console.log('Response:', response))
                    .fail( error => console.log("Err", error ))
            }else{
            }
        },
        getUrl(){
            return url.build('inventory-fulfillment/index/post')
        }
    })
})