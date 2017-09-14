(function() {
    function timecode() {
        return function(seconds) {
            output = buzz.toTimer(seconds);

            return output;
        };
    }

    angular
        .module('blocJams')
        .filter('timecode', timecode);
})();
