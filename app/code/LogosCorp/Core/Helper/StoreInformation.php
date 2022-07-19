<?php

namespace LogosCorp\Core\Helper;

use \Magento\Framework\App\Helper\Context;

class StoreInformation extends \Magento\Framework\App\Helper\AbstractHelper
{


    /**
     * @param Context $context
     */
    public function __construct(
        Context $context
    ) {
        $this->_scopeConfig          = $context->getScopeConfig();
        parent::__construct($context);
    }

    public function geStoreName()
    {
        
        $storeName='';
        try {
            //DefaultConfigStoreName
            $storeName= $this->_scopeConfig->getValue('general/store_information/name');
            
            if(empty($storeName)){
                $storeName= $this->_scopeConfig->getValue(
                    'general/store_information/name',ScopeInterface::SCOPE_STORE
                );
            }
        } catch (\Throwable $th) {
        }
        return $storeName;
    }
}