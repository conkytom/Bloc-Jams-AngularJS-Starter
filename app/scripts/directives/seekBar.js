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

        /**
        * returns the real actions and functionality of the directives
        */
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                /**
                * @desc limits the range of numbers so that we can use percentages
                */
                scope.value = 0;
                scope.max = 100;

                /**
                * @desc Holds the element that matches the directive as a jQuery Object
                * so that JQuery methods can be used on it
                * @type JQuery {Object}
                */
                var seekBar = $(element);

                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });

                /**
                * @function percentString
                * @desc Turns the scope value into percentage for use in our seek bars
                * @param none
                */
                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                /**
                * @function fillStyle
                * @desc applies a percentage to the seek bar's fill line that can be manipulated
                * @param none
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                * @function thumbStyle
                * @desc applies a percentage to the seek bar's thumb that can be manipulated
                * @param none
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
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
                    notifyOnChange(scope.value);
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
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                var notifyOnChange = function(nuevoValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({property: nuevoValue});
                    }
                };
            }
        };
    }
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
