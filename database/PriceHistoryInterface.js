var PriceHistory = require('./models/PriceHistory');

var m = module.exports = {};

m.addPriceHistory = function (time, drinks) {
    var priceHistory = new PriceHistory({
        time: time,
        drinks: drinks
    });
    priceHistory.save(function (err, priceHistory) {
        if (err) return console.error(err);
        console.log('saved');
    });
};

m.deleteAllPriceHistoryEntries = function (error, cb) {
    PriceHistory.find({
    }, function (err, priceHistorys) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for(var i in priceHistorys){
                var priceHistory = priceHistorys[i];
                if (priceHistory) {
                    priceHistory.remove(function () {
                        c++;
                        if(priceHistorys.length == c){
                            cb(c+' from '+priceHistorys.length+' deleted good!');
                        }
                    });
                }
            }
            if(priceHistorys.length < 1){
                cb(c+' from '+priceHistorys.length+' deleted good!');
            }
        }
    });
};

m.getPricesForTime = function (time, error, cb) {
    PriceHistory.find({time: time}, function (err, historyEntry) {
        if (err) {
            error(err);
        } else {
            var temp = JSON.parse(JSON.stringify(historyEntry));
            cb(temp);
        }
    });
};

m.getPriceHistory = function (error, cb) {
    PriceHistory.find({}, function (err, priceHistoryEntries) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in priceHistoryEntries) {
                ex[priceHistoryEntries[i].time] = priceHistoryEntries[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};
