var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkDatabaseInterface = require('./database/DrinkInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var guestInterface = requre('./database/GuestInterface');
var balanceInterface = require('./database/BalanceInterface');
var priceCalculator = require('./PriceCalculator');

var m = module.exports = {};
var priceEntryCache = {};

m.getPriceEntry = function (callBack) {
    priceHistoryInterface.getLatestEntry(function error(err){console.log(err)}, function cb(obj){
        callBack(obj);
    })
};

m.buyDrinks = function (priceID, guestID, drinks, callBack) {
    var price = 0;
    var received = 0;
    for(var i in drinks){
        getPriceOfDrink(priceID, drinks[i].drinkID, function cb(obj){
            price += obj*drinks[i].quantity;
            received++;
            if(drinks.length == received){
                guestInterface.getBalanceOfGuest(guestID, function cb(obj){
                    if(price < obj){
                        addConsumption(drinks, guestID, priceID, callBack);
                    }else{
                        callBack(false);
                    }
                });
            }
        });
    }
};

m.getAllDrinks = function (error, cb){
    drinkDatabaseInterface.getAllDrinks(function err(err){error(err)}, function callback(obj){cb(obj)});
};

m.addDrink = function (drink) {
    drinkDatabaseInterface.addDrink(drink.name, drink.priceMin, drink.priceMax, function cb(){});
};

m.removeDrink = function (drinkID) {
    drinkDatabaseInterface.removeDrink(drinkID);
};

m.setPrice = function (drinkID, price) {
    priceCalculator.setPrice(drinkID, price);
};

m.setDrink = function (drinkID, data) {
    drinkDatabaseInterface.setDrinkInfo(drinkID, data, function error(err){console.log(err)}, function cb(obj){console.log(obj)});
};

m.triggerStockCrash = function (decision) {
    priceCalculator.triggerStockCrash(decision);
};

getPriceOfDrink = function (priceID, drinkID, callBack){
    //TODO: implement price entry cache, so you don't have to make a database request when several drinks are bought with the same priceID
    priceHistoryInterface.getPricesForTime(priceID, function error(err){console.log(err)}, function cb(obj){
        for(var i in obj.drinks){
              if(obj.drinks[i].id == drinkID){
                callBack(obj.drinks[i].price);
              }
        }
        callBack(false);
    });
};

addConsumption = function(drinks, guestID, priceID, callBack){
    var saved = 0;
    var time = new Date().getTime();
    for(var i in drinks){
        consumptionInterface.addConsumption(guestID, priceID, drinks[i].drinkID, drinks[i].quantity, time, function cb(obj){
            saved++;
            if(drinks.length == saved){
                callBack(true);   
            }
        });
    }   
};