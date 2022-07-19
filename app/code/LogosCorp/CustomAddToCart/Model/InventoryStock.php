<?php

namespace LogosCorp\CustomAddToCart\Model;

use LogosCorp\CustomAddToCart\Api\InventoryStockInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\InventoryApi\Api\Data\StockSourceLinkInterface;
use Magento\InventoryApi\Api\GetStockSourceLinksInterface;
use Magento\Inventory\Model\SourceItem\Command\GetSourceItemsBySku;
use Magento\InventorySales\Model\ResourceModel\GetAssignedStockIdForWebsite;
use Magento\InventorySourceDeductionApi\Model\GetSourceItemBySourceCodeAndSku;

class InventoryStock implements InventoryStockInterface {
  

    public function __construct(
        StoreManagerInterface $storeManager,
        GetSourceItemsBySku $getSourceItemsBySku,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        GetStockSourceLinksInterface $getStockSourceLinks,
        GetAssignedStockIdForWebsite $getAssignedStockIdForWebsite,
        GetSourceItemBySourceCodeAndSku $getSourceItemBySourceCodeAndSku
    ){
        $this->_storeManager = $storeManager;
        $this->_getStockSourceLinks = $getStockSourceLinks;
        $this->_getSourceItemsBySku = $getSourceItemsBySku;
        $this->_getAssignedStockIdForWebsite = $getAssignedStockIdForWebsite;
        $this->_getSourceItemBySourceCodeAndSku = $getSourceItemBySourceCodeAndSku;
        $this->_searchCriteriaBuilder = $searchCriteriaBuilder;
    }

    public function getStockIdForWebsite($websiteCode)
    {
        return $this->_getAssignedStockIdForWebsite->execute($websiteCode);
    }


    /**
     * Returns Inventory Stock of Product
     *
     * @api
     * @param string $productId
     * @return array
     */
    public function get($sku)
    {
        $result = [
            'error'=>null,
            'stock'=>null,
            'success'=>false
        ];
        
        try {
            if ( !empty( $sku ) && $sku != "" ) {
              
              //source asscociated to website
              $sourceIdentified=$this->getSources();
              $stock=$this->getStock($sourceIdentified, $sku);
              $result['success']=true;
              $result['stock']=$stock;
            }    
        } catch (\Throwable $th) {
            $result['error']=$th->getMessage();
        }
        return [$result];
    }

    public function getStock($sourceIdentified, $sku)
    {
        $stock = 0;

        $sourceItems = $this->_getSourceItemsBySku->execute($sku);
            
            foreach ($sourceItems as $sourceItemId => $sourceItem) {
                if ( in_array( $sourceItem->getSourceCode(), $sourceIdentified) ){
                    $stock += $sourceItem->getQuantity();
                }
            }

        return $stock;
    }

    public function getSources()
    {
        $websiteCode = $this->_storeManager->getStore()->getWebsite()->getCode();
        $stockIdForWebsite = $this->getStockIdForWebsite($websiteCode);
        $sourceIdentified = $this->getAssignedSource($stockIdForWebsite);
        
        return array_keys($sourceIdentified);
    }

    public function getAssignedSource($stockId)
    {
        $searchCriteria = $this->_searchCriteriaBuilder
            ->addFilter(StockSourceLinkInterface::STOCK_ID, $stockId)
            ->create();

        $result = [];

        foreach ($this->_getStockSourceLinks->execute($searchCriteria)->getItems() as $link) {
            $result[$link->getSourceCode()] = $link;
        }

        return $result;
    }
}