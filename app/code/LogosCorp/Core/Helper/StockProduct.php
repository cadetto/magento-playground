<?php

/**
 * Code Example and Explanation MSI
 * https://magento.stackexchange.com/questions/266697/magento-2-3-how-to-fetch-stock-statuses-of-all-the-stores        
 */
 namespace LogosCorp\Core\Helper;

use Magento\Framework\App\Helper\Context;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\InventorySales\Model\ResourceModel\GetAssignedStockIdForWebsite;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\InventoryApi\Api\GetStockSourceLinksInterface;
use Magento\InventoryApi\Api\Data\StockSourceLinkInterface;
use Magento\Inventory\Model\SourceItem\Command\GetSourceItemsBySku;
use Magento\InventorySourceDeductionApi\Model\GetSourceItemBySourceCodeAndSku;

class StockProduct extends \Magento\Framework\App\Helper\AbstractHelper
{

    const PATH = 'logoscorp_stock_configuration/stock_configurations/stock_configuration';

    public function __construct(
        Context $context,
        StoreManagerInterface $storeManager,
        GetAssignedStockIdForWebsite $getAssignedStockIdForWebsite,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        GetStockSourceLinksInterface $getStockSourceLinks,
        GetSourceItemsBySku $getSourceItemsBySku,
        GetSourceItemBySourceCodeAndSku $getSourceItemBySourceCodeAndSku
    )
    {
        $this->_storeManager = $storeManager;
        $this->_getAssignedStockIdForWebsite = $getAssignedStockIdForWebsite;
        $this->_searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->_getStockSourceLinks = $getStockSourceLinks;
        $this->_getSourceItemsBySku = $getSourceItemsBySku;
        $this->_getSourceItemBySourceCodeAndSku = $getSourceItemBySourceCodeAndSku;
        parent::__construct($context);
    }

    public function getConfiguration()
    {
        return $this->scopeConfig->getValue(self::PATH, ScopeInterface::SCOPE_WEBSITE);
    }
    
    public function getStockIdForWebsite($websiteCode)
    {
        return $this->_getAssignedStockIdForWebsite->execute($websiteCode);
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

    public function getSources()
    {
        $websiteCode = $this->_storeManager->getStore()->getWebsite()->getCode();
        $stockIdForWebsite = $this->getStockIdForWebsite($websiteCode);
        $sourceIdentified = $this->getAssignedSource($stockIdForWebsite);
        
        return array_keys($sourceIdentified);
    }

    public function getStock($sourceIdentified, $sku)
    {
        $config = $this->getConfiguration();
        $stock = 0;

        if ($config) {

            $sourceItems = $this->_getSourceItemsBySku->execute($sku);
            
            foreach ($sourceItems as $sourceItemId => $sourceItem) {
                if ( in_array( $sourceItem->getSourceCode(), $sourceIdentified) ){
                    $stock += $sourceItem->getQuantity();
                }
            }

        } elseif (!$config && count($sourceIdentified) > 0) {

            $sourceItem = $this->_getSourceItemBySourceCodeAndSku->execute($sourceIdentified[0], $sku);
            $stock += $sourceItem->getQuantity();

        }

        return $stock;
    }

}