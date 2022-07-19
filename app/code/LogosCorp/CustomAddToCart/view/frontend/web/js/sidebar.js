/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Customer/js/model/authentication-popup',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/confirm',
    'underscore',
    'jquery-ui-modules/widget',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies',
    'jquery-ui-modules/effect-fade'
], function($, authenticationPopup, customerData, alert, confirm, _) {
    'use strict';

    //START CUSTOM CODE
    document.addEventListener('click', function(event) {
        var classTarget = "custom-add-to-cart";
        var classList = event.target.getAttribute("class"); //

        var $elementTarget = null;
        if ($(event.target).closest('.' + classTarget).length > 0) {
            $elementTarget = $(event.target).closest('.' + classTarget);
        } else if (classList != null && (classList.indexOf(classTarget) >= 0)) {
            $elementTarget = $(event.target);
        }

        //console.log('$elementTarget', $elementTarget);
        if ($elementTarget != null && !$elementTarget.hasClass('hold')) {

            //console.log('click en custom add to cart');
            // click en custom add to cart
            $elementTarget.addClass('hold');

            if ($elementTarget.find('input.qty-cart').length > 0) {
                var cantItemInCart = $elementTarget.find('input.qty-cart').val();
                cantItemInCart = parseFloat(cantItemInCart.split(' ')[0]);
                //console.log('revisa -.> input.qty-cart', cantItemInCart, (typeof cantItemInCart));
                if (cantItemInCart <= 1 | cantItemInCart <= 0.1 | cantItemInCart == "") {
                    //console.log('agrega la papelera');
                    $elementTarget.find('.qty-box').addClass('ready-to-remove').removeClass('ready-to-add').removeClass('ready-to-update');

                    //$elementTarget.find('button.removeItemCart').removeAttr('disabled');
                } else if (cantItemInCart > 0.1) {
                    //console.log('quita la papelera');
                    $elementTarget.find('.qty-box').addClass('ready-to-update').removeClass('ready-to-add').removeClass('ready-to-remove');
                    //$elementTarget.find('button.removeItemCart').attr('disabled', 'disabled');
                    //$elementTarget.find('button.qtyminus').removeAttr('disabled');

                } else {
                    $elementTarget.find('.qty-box').addClass('ready-to-add').removeClass('ready-to-update').removeClass('ready-to-remove');
                    //console.log('no quita nada');
                }
            }
            //console.log('encontrado', $elementTarget, $elementTarget.attr('class'));
        }
        // collapse all custom add to cart
        if ($('.product-item .' + classTarget + '.active:not(.hold):not(.product-add-form)').length > 0) {
            //El elemento clickeado no debe ser custom add to cart, ni hijo de custom add to cart
            //console.log('collapse all custom add to cart');
            $.each($('.product-item .' + classTarget + '.active:not(.hold):not(.product-add-form)'), function(i, e) {
                //console.log('aqui', i, $(e));
                if ($(e).hasClass('qtyupdated')) {
                    $(e).find('button.cart-item.qtyedit').trigger('click');
                    $(e).removeClass('qtyupdated');
                    var $contentBox = $(this).find('.qty-box');
                    // $contentBox.find('button.cart-item.qtyedit').hide();
                    // $contentBox.find('button.cart-item.qtyplus').show();
                    $contentBox.find('button').removeAttr('disabled');
                    $contentBox.find('input.qty-cart').attr('readonly', 'readonly');
                }
            });
            $('.product-item .' + classTarget + '.active:not(.hold):not(.product-add-form)').removeClass('active');
        }


        if ($elementTarget != null &&
            $elementTarget.hasClass('remove') &&
            $('.logoscorp.catalog-product-view .product-info-main .product-add-form.custom-add-to-cart').length > 0) {
            $('.logoscorp.catalog-product-view .product-info-main .product-add-form').removeClass('custom-add-to-cart').removeClass('active');
            //console.log('chao custom add to cart');
        }

        if ($elementTarget != null && $elementTarget.hasClass('remove')) {
            $elementTarget.removeClass('active');
            $elementTarget.removeClass('remove');
            //console.log('remove ... active and remove');
        } else if ($elementTarget != null && !$elementTarget.hasClass('active')) {
            $elementTarget.addClass('active');
            //console.log('active ... active');
        }

        if ($elementTarget != null) {
            $elementTarget.removeClass('hold');
        }
    });
    //END CUSTOM CODE

    $.widget('mage.sidebar', {
        options: {
            isRecursive: true,
            minicart: {
                maxItemsVisible: 3
            }
        },
        scrollHeight: 0,
        shoppingCartUrl: window.checkout.shoppingCartUrl,

        /**
         * Create sidebar.
         * @private
         */
        _create: function() {
            //console.log('Add to cart was created');
            this._initContent();
        },

        /**
         * Update sidebar block.
         */
        update: function() {
            //console.log('Add to cart was updating');
            $(this.options.targetElement).trigger('contentUpdated');
            this._calcHeight();
            this._updateLabelsFromProducts('AX1');
        },

        /**
         * @private
         */
        _initContent: function() {
            var self = this,
                events = {};

            this.element.decorate('list', this.options.isRecursive);
            this._updateLabelsFromProducts('AX2');
            //console.log(this.options.button);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.close] = function(event) {
                event.stopPropagation();
                $(self.options.targetElement).dropdownDialog('close');
            };
            events['click ' + this.options.button.checkout] = $.proxy(function() {
                var cart = customerData.get('cart'),
                    customer = customerData.get('customer'),
                    element = $(this.options.button.checkout);

                if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {
                    // set URL for redirect on successful login/registration. It's postprocessed on backend.
                    $.cookie('login_redirect', this.options.url.checkout);

                    if (this.options.url.isRedirectRequired) {
                        element.prop('disabled', true);
                        location.href = this.options.url.loginUrl;
                    } else {
                        authenticationPopup.showModal();
                    }

                    return false;
                }
                element.prop('disabled', true);
                location.href = this.options.url.checkout;
            }, this);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.remove] = function(event) {
                event.stopPropagation();
                confirm({
                    content: self.options.confirmMessage,
                    actions: {
                        /** @inheritdoc */
                        confirm: function() {
                            self._removeItem($(event.currentTarget));
                        },

                        /** @inheritdoc */
                        always: function(e) {
                            e.stopImmediatePropagation();
                        }
                    }
                });
            };

            /**
             * @param {jQuery.Event} event
             */
            events['keyup ' + this.options.item.qty] = function(event) {
                self._showItemButton($(event.target));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['change ' + this.options.item.qty] = function(event) {
                self._showItemButton($(event.target));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.item.button] = function(event) {
                event.stopPropagation();
                self._updateItemQty($(event.currentTarget));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['focusout ' + this.options.item.qty] = function(event) {
                self._validateQty($(event.currentTarget));
            };
            /*
            //Funcion para editar manualmente la cantidad
            $(document).on('click', '.product-item .custom-add-to-cart.active form:not(.loading) input.qty-cart', function(event) {
                //console.log('click en input.qty-cart');
                $(this).removeAttr('readonly');
                var $contentBox = $(this).closest('.qty-box');
                //$contentBox.find('button.cart-item.qtyplus').hide();
                $contentBox.find('button:not(.qtyedit)').attr('disabled', 'disabled');
                //$contentBox.find('button.cart-item.qtyedit').show();
                $(this).closest('.custom-add-to-cart').addClass('qtyupdated');
            });
            */
            $(document).on('click', '.product-item .custom-add-to-cart.active form:not(.loading) button.qtyedit', function(event) {
                $(this).closest('.custom-add-to-cart').removeClass('qtyupdated');
            });

            $(document).on('click', '.product-item .custom-add-to-cart form:not(.loading) button.cart-item', function(event) {
                event.preventDefault();
                event.stopPropagation();

                //console.log('actualiza el carrito click');

                var $contentBox = $(this).closest('.qty-box');
                var $form = $(this).closest('form');
                //var $inputCantInCart=$contentBox.find('input.qty-cart');
                var $inputCantLabel = $contentBox.find('input.qty-cart');
                var productItemInCart = null;
                //console.log('agregado inicial');


                var productId = null;
                var classList = $(this).closest('.product-item').attr('class').split(/\s+/);
                var classProductId = classList.filter(item => item.includes('id-'));
                if (classProductId.length > 0) {
                    productId = classProductId[0].split('id-')[1];
                }
                if (productId != null) {
                    var productItem = self._getProductByProductId(Number(productId));
                    //console.log('productItem',productItem);
                    if (typeof productItem != 'undefined') {
                        //productItemInCart=productItem['item_id'];
                        productItemInCart = productItem;
                        //console.log('productItemInCart',productItemInCart);

                    }
                }

                var qtyMinRequest = $(this).closest('.qty-box').data('increment');
                qtyMinRequest = (isNaN(qtyMinRequest)) ? 1 : parseFloat(qtyMinRequest);
                //console.log('qtyMinRequest', qtyMinRequest);
                var cantItemRequest = qtyMinRequest;

                var qtyMaxRequest = $(this).closest('form').find('input[name="qtyInStock"]');
                if(qtyMaxRequest.length>0){
                    qtyMaxRequest=Number(qtyMaxRequest.val());
                }else{
                    qtyMaxRequest=null;
                }

               


                var updateItemInCart = (productItemInCart != null);
                var inputCantLabelValue = $inputCantLabel.val().split(' ')[0];
                var $elementQtyPlus=($(this).hasClass('qtyplus'))?$(this):$(this).closest('.qty-box').find('.qtyplus');
                if (inputCantLabelValue != "" && !isNaN(Number(inputCantLabelValue))) {
                    cantItemRequest = parseFloat(inputCantLabelValue);
                    if ($(this).hasClass('qtyplus')) {
                        cantItemRequest = cantItemRequest + qtyMinRequest;
                    } else if ($(this).hasClass('qtyminus')) {
                        cantItemRequest = cantItemRequest - qtyMinRequest;
                    } else if ($(this).hasClass('qtyedit')) {
                        $contentBox.find('button').removeAttr('disabled');
                        $contentBox.find('input.qty-cart').removeAttr('readonly');
                    }

                    if(qtyMaxRequest!=null && (cantItemRequest>=qtyMaxRequest)){
                        $elementQtyPlus.attr('disabled','disabled');
                        $elementQtyPlus.addClass('disabled');
                    }else{
                        $elementQtyPlus.removeAttr('disabled');
                        $elementQtyPlus.removeClass('disabled');
                    }
                }

                if (cantItemRequest > 0) {
                    self._addItemOrUpdateItemInCart(updateItemInCart, $form, $inputCantLabel, productId, cantItemRequest, productItemInCart);
                }

            });

            $(document).on("click", ".product-item .custom-add-to-cart.active form:not(.loading) .removeItemCart", function(event) {
                event.preventDefault();
                event.stopPropagation();

                var productId = null;
                var classList = $(this).closest('.product-item').attr('class').split(/\s+/);
                var classProductId = classList.filter(item => item.includes('id-'));
                if (classProductId.length > 0) {
                    productId = classProductId[0].split('id-')[1];
                }

                var productItem = self._getProductByProductId(Number(productId));
                if (typeof productItem != 'undefined') {
                    //console.log(productItem);
                    var itemId = productItem['item_id'];
                    $(this).data('cart-item', productItem);
                    var $inputCantLabel = $(this).closest('form').find('input.qty-cart');
                    var thisContext = $(this);

                    $inputCantLabel.val(0);

                    var $form = thisContext.closest('form');
                    //$form.find('input.qty-cart').val(0);

                    var $customAddToCart = thisContext.closest('.custom-add-to-cart');
                    $customAddToCart.addClass('remove');

                    self._loadingCustomAddToCart($form, true);

                    self._ajax(self.options.url.remove, {
                        'item_id': itemId
                    }, thisContext, function() {
                        //toastr.success("Eliminaste " + productItem['product_name'] + " de tu carrito de compras.", "");
                        self._loadingCustomAddToCart($form, false);
                        self._removeItemAfter
                    });
                } else {
                    //console.info('Product Item ' + productItem + ' not loaded in cart');
                }
            });

            this._on(this.element, events);
            this._calcHeight();
        },

        _loadingCustomAddToCart: function($form, enableLoading) {
            if (enableLoading) {
                $form.addClass('loading');
                //$form.find('button').attr('disabled', 'disabled');
            } else {
                $form.find('input.qty').val('');
                $form.removeClass('loading');
                //$form.find('button').removeAttr('disabled');
            }
        },

        _addItemOrUpdateItemInCart: function(update, $form, $inputCantLabel, productId, cantToUpdate, productItemInCart) {
            $inputCantLabel.val(cantToUpdate + ((cantToUpdate > 1) ? ' uds.' : ' ud.'));
            var self = this;
            setTimeout(function() {
                var cantRequestNew = parseFloat($inputCantLabel.val());
                if (cantRequestNew == cantToUpdate || cantToUpdate == null) {
                    //$form.addClass('loading');
                    $form.addClass('pending-remove-loader');
                    self._loadingCustomAddToCart($form, true);
                    if (update) {
                        self._ajax(self.options.url.update, {
                            'item_id': productItemInCart['item_id'],
                            'item_qty': cantToUpdate,
                        }, $form, function() {
                            self._loadingCustomAddToCart($form, false);
                            self._updateItemQtyAfter
                        });
                    } else {
                        $form.find('input.qty').val(((cantToUpdate > 1) ? ' uds.' : ' ud.'));
                        $form.submit();
                    }
                } else {
                    //console.log('espera');
                }
            }, 500);


        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _showItemButton: function(elem) {

            var itemId = elem.data('cart-item'),
                itemQty = elem.data('item-qty');

            if (this._isValidQty(itemQty, elem.val())) {
                $('#update-cart-item-' + itemId).show('fade', 300);
            } else if (elem.val() == 0) { //eslint-disable-line eqeqeq
                this._hideItemButton(elem);
            } else {
                this._hideItemButton(elem);
            }
        },

        /**
         * @param {*} origin - origin qty. 'data-item-qty' attribute.
         * @param {*} changed - new qty.
         * @returns {Boolean}
         * @private
         */
        _isValidQty: function(origin, changed) {
            return origin != changed &&
                changed.length > 0 &&
                changed - 0 == changed &&
                changed - 0 > 0;
        },

        /**
         * @param {Object} elem
         * @private
         */
        _validateQty: function(elem) {
            var itemQty = elem.data('item-qty');

            if (!this._isValidQty(itemQty, elem.val())) {
                elem.val(itemQty);
            }
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _hideItemButton: function(elem) {
            var itemId = elem.data('cart-item');

            $('#update-cart-item-' + itemId).hide('fade', 300);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _updateItemQty: function(elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.update, {
                'item_id': itemId,
                'item_qty': $('#cart-item-' + itemId + '-qty').val()
            }, elem, this._updateItemQtyAfter);
        },

        /**
         * Update content after update qty
         *
         * @param {HTMLElement} elem
         */
        _updateItemQtyAfter: function(elem) {
            //console.log('_updateItemQtyAfter');
            var productData = this._getProductById(Number(elem.data('cart-item')));

            if (!_.isUndefined(productData)) {
                $(document).trigger('ajax:updateCartItemQty');

                if (window.location.href === this.shoppingCartUrl) {
                    window.location.reload(false);
                }
            }
            this._hideItemButton(elem);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _removeItem: function(elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.remove, {
                'item_id': itemId
            }, elem, this._removeItemAfter);
        },

        /**
         * Update content after item remove
         *
         * @param {Object} elem
         * @private
         */
        _removeItemAfter: function(elem) {
            var productData = this._getProductById(Number(elem.data('cart-item')));
            if (!_.isUndefined(productData)) {
                if ($('.logoscorp .product-item.id-' + productData['product_id'] + ' input.qty-cart').length > 0) {
                    $('.logoscorp .product-item.id-' + productData['product_id'] + ' input.qty-cart').val(0);
                }
                $(document).trigger('ajax:removeFromCart', {
                    productIds: [productData['product_id']],
                    productInfo: [{
                        'id': productData['product_id']
                    }]
                });
                if (window.location.href.indexOf(this.shoppingCartUrl) === 0) {
                    window.location.reload();
                }
            }
        },

        /**
         * Update labels Qty from products.
         *
         * @private
         */
        _updateLabelsFromProducts: function(whocallme) {
            var self = this;
            //console.log('_updateLabelsFromProducts', whocallme);
            try {
                //jQuery('.logoscorp .product-items .qty-box').removeClass('ready-to-remove');
                $('.logoscorp .product-item .qty-box').addClass('ready-to-add').removeClass('ready-to-update').removeClass('ready-to-remove');

                var labelsInCartToUpdate = new Object();
                var productIdInProductPage = null;

                if ($('.logoscorp.catalog-product-view .product-add-form:not(.custom-add-to-cart)').length > 0 &&
                    $('.logoscorp.catalog-product-view #product_addtocart_form input[name="product"]').length > 0) {
                    var productIdInProductPage = parseFloat($('.logoscorp.catalog-product-view #product_addtocart_form input[name="product"]').val());
                    if (!isNaN(productIdInProductPage) && productIdInProductPage > 0) {
                        $('.logoscorp.catalog-product-view .product-info-main').addClass('product-item id-' + productIdInProductPage);
                    }
                }
                if ($('.logoscorp.catalog-product-view .product-add-form:not(.custom-add-to-cart) #product_addtocart_form')) {
                    var productIdInProductPage = null;
                }

                var itemsInCart = customerData.get('cart')().items;
                itemsInCart.forEach(function(item) {
                    var cant = item['qty'];
                    var productId = item['product_id'];

                    if (cant > 0) {
                        if (labelsInCartToUpdate.hasOwnProperty(productId)) {
                            labelsInCartToUpdate[productId] += cant;
                        } else {
                            labelsInCartToUpdate[productId] = cant;
                        }

                        //if (labelsInCartToUpdate[productId] == 1) {
                        if (cant == 1 || cant == 0.1) {
                            $('.logoscorp .product-item.id-' + productId + ' .qty-box')
                                .addClass('ready-to-remove')
                                .removeClass('disabled')
                                .removeClass('ready-to-add')
                                .removeClass('ready-to-update');

                            //console.log('ready-to-remove', productId);
                            //} else if (labelsInCartToUpdate[productId] > 1) {
                        } else if (cant > 0.1) {
                            $('.logoscorp .product-item.id-' + productId + ' .qty-box')
                                .addClass('ready-to-update')
                                .removeClass('disabled')
                                .removeClass('ready-to-add')
                                .removeClass('ready-to-remove');
                            //console.log('ready-to-update', productId);
                        }

                        if ($('.logoscorp.catalog-product-view .product-info-main.product-item.id-' + productId).length > 0) {
                            $('.logoscorp.catalog-product-view .product-add-form').addClass('custom-add-to-cart active');
                        }

                        if (Number($('.logoscorp .product-item.id-' + productId + ' form input.qty-cart').val()) !=labelsInCartToUpdate[productId]) {
                            $('.logoscorp .product-item.id-' + productId + ' form input.qty-cart').val(labelsInCartToUpdate[productId] + ((labelsInCartToUpdate[productId] > 1) ? ' uds.' : ' ud.'));
                            //$('.logoscorp .product-item.id-' + productId + ' form input.qty-cart').val(labelsInCartToUpdate[productId]);
                        }

                        if ($('.logoscorp .product-item.id-' + productId + ' form.pending-remove-loader').length > 0) {
                            self._loadingCustomAddToCart($('.logoscorp .product-item.id-' + productId + ' form'), false);
                            $('.logoscorp .product-item.id-' + productId + ' form').removeClass('pending-remove-loader');
                        }

                        var qtyMaxRequest=$('.logoscorp .product-item.id-' + productId + ' form input[name="qtyInStock"]');
                        var $elementQtyPlus=$('.logoscorp .product-item.id-' + productId + ' form .qty-box .qtyplus');
                        if(qtyMaxRequest.length>0){
                            qtyMaxRequest=Number(qtyMaxRequest.val());
                        }else{
                            qtyMaxRequest=null;
                        }
                        
                        if($elementQtyPlus.length>0 && qtyMaxRequest!=null && (labelsInCartToUpdate[productId]>=qtyMaxRequest)){
                            $elementQtyPlus.addClass('disabled');
                            $elementQtyPlus.attr('disabled','disabled');
                        }else{
                            $elementQtyPlus.removeClass('disabled');
                            $elementQtyPlus.removeAttr('disabled');
                        }

                    }
                });
            } catch (error) {
                console.log('Error', error);
            }
        },

        /**
         * Retrieves product data by Id.
         *
         * @param {Number} productId - product Id
         * @returns {Object|undefined}
         * @private
         */
        _getProductById: function(productId) {
            return _.find(customerData.get('cart')().items, function(item) {
                return productId === Number(item['item_id']);
            });
        },

        /**
         * Retrieves product data by Id.
         *
         * @param {Number} productId - product Id
         * @returns {Object|undefined}
         * @private
         */
        _getProductByProductId: function(productId) {
            return _.find(customerData.get('cart')().items, function(item) {
                return productId === Number(item['product_id']);
            });
        },

        _requestStock: function (url,form) {
            try{
                let sku=$(form).data('product-sku');
                let productId=$(form).find('input[name="product"]').val();
                if(url.includes("/updateItemQty/") && typeof sku !='undefined' ){
                    let url='http://biomercado.docker/rest/V1/logoscorp/inventorystock/product/'+sku;
                    $.ajax({url: url,type: 'post',})
                    .done(function(response) {
                        if(response.length>0){
                            response=response[0];
                            if(typeof response.success != 'undefined' && response.success && response.stock!=null){
                                $('.logoscorp .product-item.id-' + productId).each(function(i,e){
                                    $(e).find('form input[name="qtyInStock"]').val(response.stock);
                                    $(e).find('.stock-qty .qty').html(response.stock);
                                });
                            }
                        }
                    });
                }
            } catch (error) {
                console.log('Error', error);
            }
        },

        /**
         * @param {String} url - ajax url
         * @param {Object} data - post data for ajax call
         * @param {Object} elem - element that initiated the event
         * @param {Function} callback - callback method to execute after AJAX success
         */
        _ajax: function(url, data, elem, callback) {
            $.extend(data, {
                'form_key': $.mage.cookies.get('form_key')
            });
            //console.log(this.options,url);
            $.ajax({
                    url: url,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    context: this,

                    /** @inheritdoc */
                    beforeSend: function() {
                        elem.attr('disabled', 'disabled');
                    },

                    /** @inheritdoc */
                    complete: function() {
                        elem.attr('disabled', null);
                    }
                })
                .done(function(response) {
                    var msg;

                    if (response.success) {
                        callback.call(this, elem, response);
                    } else {
                        this._requestStock(url,elem);
                        msg = response['error_message'];

                        if (msg) {
                            alert({
                                content: msg
                            });
                        }
                    }
                })
                .fail(function(error) {
                    //console.log(JSON.stringify(error));
                });
        },

        /**
         * Calculate height of minicart list
         *
         * @private
         */
        _calcHeight: function() {
            var self = this,
                height = 0,
                counter = this.options.minicart.maxItemsVisible,
                target = $(this.options.minicart.list),
                outerHeight;

            self.scrollHeight = 0;
            target.children().each(function() {

                if ($(this).find('.options').length > 0) {
                    $(this).collapsible();
                }
                outerHeight = $(this).outerHeight(true);

                if (counter-- > 0) {
                    height += outerHeight;
                }
                self.scrollHeight += outerHeight;
            });

            target.parent().height(height);
        }
    });

    return $.mage.sidebar;
});