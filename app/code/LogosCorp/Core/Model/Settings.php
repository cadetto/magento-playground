<?php

namespace LogosCorp\Core\Model;

/**
 * Class Settings
 * @package LogosCorp\Core\Model
 */
class Settings
{
    
   
    //LABEL SETTINGS
    const SETTINGS_SHOW_LABELS_PRODUCT_DISCOUNT = 'logoscorp_custom_labels/general_settings/show_label_product_discount';
    const SETTINGS_TEXT_LABELS = 'logoscorp_custom_labels/general_settings/text_label';
    const SETTINGS_SHOW_DECIMALS_ON_DISCOUNT_PERCENTAGE = 'logoscorp_custom_labels/general_settings/show_decimals_on_discount_percentage';
    const SETTINGS_SHOW_LABELS_PRODUCT_NEW = 'logoscorp_custom_labels/general_settings/show_label_product_new';

    
    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $_scopeConfig;

    /**
     * Settings constructor.
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        $this->_scopeConfig = $scopeConfig;
    }

    
    /*
    * @return SETTINGS_SHOW_LABELS_PRODUCT_DISCOUNT
    */
    public function getSettingsShowLabelsProductDiscount()
    {
        return  $this->_scopeConfig->getValue(self::SETTINGS_SHOW_LABELS_PRODUCT_DISCOUNT, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    } 

    /*
    * @return SETTINGS_SHOW_LABELS_PRODUCT_NEW
    */
    public function getSettingsShowLabelsProductNew()
    {
        return  $this->_scopeConfig->getValue(self::SETTINGS_SHOW_LABELS_PRODUCT_NEW, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    } 

    /*
    * @return SETTINGS_TEXT_LABELS
    */
    public function getSettingsTextLabels()
    {
        return  $this->_scopeConfig->getValue(self::SETTINGS_TEXT_LABELS, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    } 

    /*
    * @return SETTINGS_SHOW_DECIMALS_ON_DISCOUNT_PERCENTAGE
    */
    public function getSettingsShowDecimalsOnDiscountPercentage()
    {
        return  $this->_scopeConfig->getValue(self::SETTINGS_SHOW_DECIMALS_ON_DISCOUNT_PERCENTAGE, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    } 


    
    
}