<?php

namespace LogosCorp\CustomAddToCart\Api;

interface InventoryStockInterface {

    /**
     * Returns Inventory Stock of Product
     *
     * @api
     * @param string $sku
     * @return array
     */
    public function get($sku);
    
}