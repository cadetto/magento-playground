<?php
namespace LogosCorp\CustomAddToCart\Block;

use \Magento\Store\Model\ScopeInterface;

class LabelPriceByWeight extends \Magento\Catalog\Block\Product\View
{

     /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $_scopeConfig;

    /**
     * @param Context $context
     * @param \Magento\Framework\Url\EncoderInterface $urlEncoder
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Magento\Framework\Stdlib\StringUtils $string
     * @param \Magento\Catalog\Helper\Product $productHelper
     * @param \Magento\Catalog\Model\ProductTypes\ConfigInterface $productTypeConfig
     * @param \Magento\Framework\Locale\FormatInterface $localeFormat
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Magento\Catalog\Api\ProductRepositoryInterface|\Magento\Framework\Pricing\PriceCurrencyInterface $productRepository
     * @param \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency
     * @param array $data
     * @codingStandardsIgnoreStart
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Url\EncoderInterface $urlEncoder,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Framework\Stdlib\StringUtils $string,
        \Magento\Catalog\Helper\Product $productHelper,
        \Magento\Catalog\Model\ProductTypes\ConfigInterface $productTypeConfig,
        \Magento\Framework\Locale\FormatInterface $localeFormat,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency,
        array $data = []
    ) {
        
        parent::__construct(
            $context,
            $urlEncoder,
            $jsonEncoder,
            $string,
            $productHelper,
            $productTypeConfig,
            $localeFormat,
            $customerSession,
            $productRepository,
            $priceCurrency,
            $data
        );
        $this->_scopeConfig         = $context->getScopeConfig();
    }


    public function getLabel() {
        $_product=$this->getProduct();
        $attibuteCode=$this->getAttributeCodeToValidateLabelPriceByWeight();
        $applyLabel=(!empty($attibuteCode))?($_product->getData($attibuteCode)=='1'):false;

        if($this->isEnableLabelPriceByWeight() && $applyLabel){
            return $this->getTextLabel();
        }
    }

    public function isEnableLabelPriceByWeight(){
        $path = "logoscorp_custom_labels/product_view_settings/enable_label_price_by_weight";
        $scope = ScopeInterface::SCOPE_STORE;
        return $this->_scopeConfig->getValue($path, $scope)=="1";
    }

    public function getAttributeCodeToValidateLabelPriceByWeight(){
        $path = "logoscorp_custom_labels/product_view_settings/atribute_code_price_by_weight";
        $scope = ScopeInterface::SCOPE_STORE;
        return $this->_scopeConfig->getValue($path, $scope);
    }

    public function getTextLabel(){
        $path = "logoscorp_custom_labels/product_view_settings/text_label";
        $scope = ScopeInterface::SCOPE_STORE;
        return $this->_scopeConfig->getValue($path, $scope);
    }


}