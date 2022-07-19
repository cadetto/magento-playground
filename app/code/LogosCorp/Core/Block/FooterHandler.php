<?php
namespace Logoscorp\Core\Block;

use Magento\Framework\View\Element\Template;

class FooterHandler extends Template {
    
    protected $scopeConfig;

    /**
     * Constructor
     * @param Template\Context $context
     * @param array $data
     */
    public function __construct(
        Template\Context $context, 
        array $data = [], 
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig, 
        \Magento\Cms\Api\BlockRepositoryInterface $blockRepository
    ) {
        parent::__construct( $context, $data );
        $this->_scopeConfig = $scopeConfig;
        $this->_blockRepository = $blockRepository;
    }

    public function getBreakointAccordion() {
        $breakpointAccordion = $this->_scopeConfig->getValue('logoscorp_footer/footer_group/breakpoint_accordion', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        if (empty($breakpointAccordion) || !is_numeric($breakpointAccordion)) { 
            return '768';
        }
        return $breakpointAccordion;
    }

    public function getFirstColumnNoAccordion() {
        $firstColumnNoAccordion = $this->_scopeConfig->getValue('logoscorp_footer/footer_group/first_column_no_accordion', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        return (!empty($firstColumnNoAccordion) && $firstColumnNoAccordion=="1");
    }

    

    public function getTitleColumn($column) {
        return $this->_scopeConfig->getValue('logoscorp_footer/footer_group/block_title_column'.$column, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    }

    public function getContentBlock($column) {
        $blockId = $this->_scopeConfig->getValue('logoscorp_footer/footer_group/block_content_column'.$column, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        if (empty($blockId)) { 
            return '';
        }
        return $this->returnCmsBlock($blockId);
    }

    public function getCopyRightBlock() {
        $blockId = $this->_scopeConfig->getValue('logoscorp_footer/footer_group/block_copyright', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        if (empty($blockId)) { 
            return '';
        }
        return $this->returnCmsBlock($blockId);
    }

    public function returnCmsBlock($blockId) {
        $cmsBlock = $this->getLayout()
                      ->createBlock('Magento\Cms\Block\Block')
                      ->setBlockId($blockId)
                      ->toHtml();
        return $cmsBlock;
    }
}

