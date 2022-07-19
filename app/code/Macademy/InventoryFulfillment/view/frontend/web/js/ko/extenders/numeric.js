define([
    'ko'
], function(ko){
    'use strict';

    /*
        Puedo llamar un extendible cuando quiera modificar el funcionamiento de un observable de ko
        y poder correr un codigo custom cada vez que el mismo se "triggeree" o se llame
    */


    // La variable opcion se refiere a los valores que llamo en la declaracion del extend, en este caso, es true.
    // ver el archivo web/js/model/box-configurations en donde este se llama
    // Ver deferred updates en docs de knockout para tener mas opciones de renderizado

    ko.extenders.numeric = function(target, option){

        // Una funcion pura siempre devuelve el mismo resultado con el mismo input
        // En este caso, en vez de llamar a la funcion computed, llamo a otra
        // llamada pureComputed, porque este obnjeto y la funcion que esta adentro
        // puede ser condiderada pura. Knockout va a correr esta funcion de una
        // manera mas eficiente
        const result = ko.pureComputed({
            read: target,
            write: function(value){
                // Convert the string to number and round it - The value on the function refers to the value of the observable
                target(Math.round(value))
            }
        //When to notify the observable to trigger
        }).extend({notify: 'always'})

        //Iguala la propiedad computed (result) al target que fue definido en la funcion write del objeto que se esta pasando a computed 
        result(target())

        return result;
    }
})