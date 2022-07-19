<?php


namespace LogosCorp\Core\Block;

use Magento\Catalog\Model\Product as ModelProduct;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Widget\Block\BlockInterface;
use Magento\Framework\Stdlib\DateTime\TimezoneInterface;


class CustomLabelsBlock extends Template implements BlockInterface
{   


    protected $_label;
    protected $_product;
    protected $_showDecimals;

    protected $_showLabelProductDiscount;
    protected $_showLabelProductNew;

        /**
     * @var TimezoneInterface
     */
    protected $_localeDate;

    /**
     * @param TimezoneInterface $localeDate
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        TimezoneInterface $localeDate,
        Context $context,
        $data = []
        )
    {
        $this->_localeDate = $localeDate;
        $this->_label = null;
        $this->_product = null;
        $this->_showDecimals=false;
        $this->_showLabelProductDiscount=false;
        $this->_showLabelProductNew=false;
        parent::__construct($context, $data);
    }



    public function isProductNew()
    {
       try {
            $newsFromDate = $this->_product->getNewsFromDate();
            $newsToDate = $this->_product->getNewsToDate();
            if (!$newsFromDate && !$newsToDate) {
                return false;
            }

            return $this->_localeDate->isScopeDateInInterval(
                $this->_product->getStore(),
                $newsFromDate,
                $newsToDate
            );
       } catch (\Throwable $th) {
            return false;
       }
    }

    public function isPatrocinado(){
        return $this->_product->getCustomAttribute('patrocinado')? !!$this->_product->getCustomAttribute('patrocinado')->getValue(): false;
    }

    public function isBioInsuperable(){
        return $this->_product->getCustomAttribute('bioinsuperable') ? !!$this->_product->getCustomAttribute('bioinsuperable')->getValue() : false;
    }

    public function setProduct(ModelProduct $product){
        if(!is_null($product)){
            $this->_product = $product;
        }
    }

    public function setShowLabelProductDiscount($showLabelProductDiscount){
        if(!empty($showLabelProductDiscount)
        && $showLabelProductDiscount=="1"){
            $this->_showLabelProductDiscount = true;
        }
    }

    public function setShowLabelProductNew($showLabelProductNew){
        if(!empty($showLabelProductNew)
        && $showLabelProductNew=="1"){
            $this->_showLabelProductNew = true;
        }
    }

    public function getShowLabelProductDiscount(){
        return $this->_showLabelProductDiscount;
    }

    public function getShowLabelProductNew(){
        return $this->_showLabelProductNew;
    }

    public function getProduct(){
        return $this->_product;
    }

    public function getDiscountLabel(){
        $result=[
            'apply'=>false,
            'discount'=>null
        ];
        try {
            if($this->_product->getTypeId()=='simple'){
                $price=$this->_product->getPrice();
                $finalPrice=$this->_product->getFinalPrice();
                if(is_numeric($price) && is_numeric($finalPrice)){
                    $price=floatval($price);
                    $finalPrice=floatval($finalPrice);
                    if($price>0 && $finalPrice>0 && $finalPrice<$price){
                        $apply=true;
                        if($finalPrice<$price){

                            if(is_null($this->_label)){
                                $discount=$price-$finalPrice;
                                $discount=floatval(($discount/$price)*100);

                                if($this->_showDecimals){
                                    $discount= number_format($discount,1);
                                }else{
                                    $discount= intval($discount);
                                }
                                $result['discount'] = '-'.$discount.'%';   
                            }else{
                                $result['discount'] = $this->_label;
                            }
                            $result['apply']=true;
                        }
                    }
                }
            }
        } catch (\Throwable $th) {
        }
        
        return $result;
    }

    function setLabel($label){
        if(!is_null($label) && !is_numeric($label) && !empty(trim($label))){
            $this->_label = trim($label);
        }
    }

    function setShowDecimals($showDecimals){
        $this->_showDecimals=(!empty($showDecimals) && $showDecimals=="1");
    }

    function getLabel(){
        $discountLabel=$this->getDiscountLabel();

        if( $this->isBioInsuperable() ){
            $borderClass = "custom-border bioinsuperable";
            $specialTag = "bioinsuperable"; 
        }                    
        elseif( $this->isPatrocinado() ){
            $borderClass = "custom-border patrocinado";
            $specialTag = "patrocinante";
        } 
        /*                   
        elseif($this->getShowLabelProductNew() && $this->isProductNew()){
            $borderClass = "custom-border nuevo";
            $specialTag = "nuevo";
        }
        */
        else{
            $borderClass = '';
            $specialTag = null;
        }
        return [
            'borderClass' =>$borderClass,
            'specialTag' =>$specialTag
        ];
    }


    protected $_template = "discountlabels.phtml";
    
}
