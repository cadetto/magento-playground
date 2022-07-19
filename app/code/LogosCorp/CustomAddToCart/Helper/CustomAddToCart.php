<?php
namespace LogosCorp\CustomAddToCart\Helper;

use Magento\CatalogInventory\Api\StockRegistryInterface;

class CustomAddToCart extends \Magento\Framework\App\Helper\AbstractHelper
{


    /**
     * @var StockRegistryInterface
     */
    public $_stockRegistry;

    /**
     * Output constructor.
     * @param \Magento\Framework\App\Helper\Context $context
     * @param StockRegistryInterface $stockRegistry
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        StockRegistryInterface $stockRegistry
    ) {
        $this->_stockRegistry=$stockRegistry;
        parent::__construct($context);
    }


    /**
     */
    public function getStockRegistry($productSku, $websiteId = null)
    {
        return  $this->_stockRegistry->getStockItemBySku($productSku);;
    }

    private function _getIncrementCount($productSku){
        $incrementNumber=1; //Default
        $stockRegistry=$this->getStockRegistry($productSku);
        try {
            if($stockRegistry->getUseConfigQtyIncrements()){
                $incrementNumber=$stockRegistry->getMinSaleQty();
            }else{
                $incrementNumber=floatVal($stockRegistry->getData('qty_increments'));
            }
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $incrementNumber;
    }

    
    public function getHtml($productSku,$qtyProductInStock=null,$includeSumbit=true,$incart=false) {

        $html='';
            if(!is_null($qtyProductInStock)){
                $html='<input type="hidden" name="qtyInStock" value="'.$qtyProductInStock.'">';
            }
            $html.='<div class="qty-box ready-to-add" data-increment="'.$this->_getIncrementCount($productSku).'">';
            $html.='<div class="loader"></div>';
            $html.='<input type="hidden" name="qty" maxlength="12" value="" title="'.__('Qty').'" class="input-text qty" />';
            $html.='<div class="box-column-1">';
                $html.='<label>'.__('Agregado').'</label>';
                $html.='<input type="text" class="qty-cart" readonly>';
            $html.='</div>';
            $html.='<div class="box-column-2">';
                $html.='<button class="removeItemCart"></button>';
                $html.='<button class="qtyminus cart-item"></button>';
                $html.='<button class="qtyplus cart-item"></button>';
                //$html.='<button class="qtyedit cart-item"><span></span></button>';
            $html.='</div>';
                if($includeSumbit){
                    $html.='<button type="submit" title="'.__('Add to Cart').'" class="action tocart primary">';
                    $html.='<span>'.__('Add to Cart').'</span>';
                    $html.='</button>';
                }
            $html.='</div>';
            
        if($incart){
            $htmlLabelInCart='<div class="label-in-cart">';
            $htmlLabelInCart.='<span>En el carrito</span>';
            $htmlLabelInCart.='</div>';
            $html='<div class="container-qty-box">'.$html.$htmlLabelInCart.'</div>';
        }

        return $html;
    }

}