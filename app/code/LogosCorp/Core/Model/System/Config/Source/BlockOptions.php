<?php
 
namespace LogosCorp\Core\Model\System\Config\Source;
 
class BlockOptions implements \Magento\Framework\Option\ArrayInterface
{   

    protected $_blockRepository;
    protected $_searchCriteriaBuilder;


    public function __construct(
        \Magento\Cms\Api\BlockRepositoryInterface $blockRepository,
        \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
    ) {
        $this->_blockRepository = $blockRepository;
        $this->_searchCriteriaBuilder = $searchCriteriaBuilder;
    }


    public function getCmsBlock() {
        $searchCriteria = $this->_searchCriteriaBuilder->create();
        $cmsBlocks = $this->_blockRepository->getList($searchCriteria)->getItems();
        return $cmsBlocks;
    }

    /**
     * @return array
     */
    public function toOptionArray()
    {
        $data=[];
        $cmsBlocks = $this->getCmsBlock();

        $data[]=['value' => ' ', 'label' => ' '];
        foreach($cmsBlocks as $cmsBlock) {
            $data[]=['value' => $cmsBlock->getId(), 'label' => $cmsBlock->getTitle()];
        }
        return $data;
    }
}