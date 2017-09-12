(function() {
    function seekBar($document) {

        /**
        * @function calculatePercent
        * @desc Calculates the horizontal percent along the seek bar where the event occurred.
        * @param seekBar and event
        */
        var calculatePercent = function (seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXpercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attributes) {
                scope.value = 0;
                scope.max = 100;

                /**
                * @desc Holds the element that matches the directive as a jQuery Object
                * so that JQuery methods can be used on it
                * @type JQuery {Object}
                */
                var seekBar = $(element);

                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                * @function onClickSeekBar
                * @desc Updates the seek bar value based on the seek bar's width and the location
                * of the user's click on the seek bar
                * @param event
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };

                /**
                * @function trackThumb
                * @desc uses apply to link the user dragging the mouse to the seek bar thumb
                * @param none
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
            }
        };
    }
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
