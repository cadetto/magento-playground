<?php

namespace LogosCorp\Core\Helper;

use Magento\Catalog\Model\Product as ModelProduct;
use Magento\Framework\View\LayoutInterface;
use LogosCorp\Core\Block\CustomLabelsBlock;
use LogosCorp\Core\Model\Settings as SettingsLogoscorp;

class CustomLabels extends \Magento\Framework\App\Helper\AbstractHelper
{

    protected $_customLabelsBlock;
    protected $_customLabel;
    protected $_settingsLogoscorp;
    protected $_labels;
    protected $_borderLabel;



    /**
     * @param CustomLabelsBlock $customLabelsBlock
     * @param SettingsLogoscorp $settingsLogoscorp
   
     */
    public function __construct(
        CustomLabelsBlock $customLabelsBlock,
        SettingsLogoscorp $settingsLogoscorp
    ) {
      
        $this->_customLabelsBlock= $customLabelsBlock;
        $this->_settingsLogoscorp= $settingsLogoscorp;
        $this->_labels='';
        $this->_borderLabel='';
        $this->initSettings();
    }

    public function initSettings(){
        $this->_customLabelsBlock->setLabel($this->_settingsLogoscorp->getSettingsTextLabels());
        $this->_customLabelsBlock->setShowDecimals($this->_settingsLogoscorp->getSettingsShowDecimalsOnDiscountPercentage());
        $this->_customLabelsBlock->setShowLabelProductDiscount($this->_settingsLogoscorp->getSettingsShowLabelsProductDiscount());
        $this->_customLabelsBlock->setShowLabelProductNew($this->_settingsLogoscorp->getSettingsShowLabelsProductNew());
    }


    public function getLabels($product){
        $this->_labels=$this->_customLabelsBlock->setProduct($product);
        return 
        [
            'result'=>$this->_customLabelsBlock->getLabel(),
            'html'=>$this->_customLabelsBlock->toHtml()
        ];
    }
}
