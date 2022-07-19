<?php
namespace Logoscorp\Core\Helper;

use Logoscorp\Core\Block\CustomerIconMenu;

class CustomerSession extends \Magento\Framework\App\Helper\AbstractHelper
{

    /**
     * @var CustomerStatus
    */
    private $_customerAlpha;

     /**
      * @param CustomerIconMenu $customerAlpha
     */

    public function __construct(CustomerIconMenu $customerAlpha) {
        $this->_customerAlpha = $customerAlpha;
    }

    public function getCustomerSessionStatus() {
        return $this->_customerAlpha->getCustomerSessionStatus();
    }

}