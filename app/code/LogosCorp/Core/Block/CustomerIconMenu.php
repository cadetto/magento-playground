<?php
namespace Logoscorp\Core\Block;
use Magento\Framework\View\Element\Template;
use Magento\Customer\Model\SessionFactory;
use Magento\Customer\Model\Session as SessionCustomer;
use Magento\Widget\Block\BlockInterface;

class CustomerIconMenu extends Template implements BlockInterface{
      /**
     * @var SessionFactory
     */
    protected $_sessionFactory;
  /**
   * Constructor
   * @param SessionFactory $sessionFactory
   * @param Template\Context $context
   * @param SessionCustomer $session
   * @param array $data
   */
  public function __construct(
    SessionFactory $sessionFactory,
    SessionCustomer $session,
    Template\Context $context, 
    array $data = [])
  {
    parent::__construct($context, $data);
    $this->_customerSession = $session;
    $this->_sessionFactory = $sessionFactory;
  }

  public function getCustomerSessionStatus() {
    $customerId=$this->getCustomerInSession();
    return (!is_null($customerId) && is_numeric($customerId));
  }

  private function getCustomerInSession(){
      $result=null;
      try {
          $result=$this->_sessionFactory->create()->getCustomerData()->getId();
      } catch (\Throwable $th) {
      }
      return $result;
  }

 
}