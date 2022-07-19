define(['jquery'], function($) {
    'use strict';
    return function(classname, duration){
        $(classname).hide().fadeIn(duration)
    }
});