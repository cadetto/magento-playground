<?php

namespace Macademy\InventoryFulfillment\Controller\Index;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\JsonFactory;

class Post implements HttpPostActionInterface
{

    private $jsonFactory;

    public function __construct(
        JsonFactory $jsonFactory
    ){
        $this->jsonFactory = $jsonFactory;
    }

    public function execute()
    {
       $json = $this->jsonFactory->create();
       return $json->setData(['succeess from post.php' => true]);
    }
}