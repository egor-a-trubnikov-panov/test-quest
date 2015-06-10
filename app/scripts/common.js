!(function () {

	'use strict';

	function simple_range(elem, config) {

		function on(el, ev, fn) {
			if (el[addEventListener]) {
				el[addEventListener](ev, fn, F);
			} else if (el[attachEvent]) {
				el[attachEvent]('on' + ev, fn);
			} else {
				el['on' + ev] = fn;
			}
		}

		function updateDrag(event) {
			event = event || window.event;
			Position = isVertical ? event.pageY : event.pageX;
			if (!Position) {
				if (isVertical) {
					Position = event.clientY + body[scrollTop] + docElement[scrollTop];
				} else {
					Position = event.clientX + body[scrollLeft] + docElement[scrollLeft];
				}
			}

			if (down && Position >= rangeOffset && Position <= (rangeOffset + rangeWidth)) {
				cachePosition = Math.round(((Position - rangeOffset) / rangeWidth) * 100);
				if (Array.isArray(step)) {
					for (var i = 0; i < length; i++) {
						if (cachePosition === step[i]) {
							paint();
						}
					}
				} else {
					if (!Boolean(cachePosition % step)) {
						paint();
					}
				}
			}
		}

		function paint() {
			drag.style[Style] = ((cachePosition / 100) * rangeWidth - (dragWidth / 2)) + 'px';
			config.drag(cachePosition);
		}

		function initDrag() {
			woh = drag[Width];
			cachePosition = ((config.value / 100) * range[Width]);
			drag.style[Style] = (cachePosition - (woh / 2)) + 'px';
			config.drag(config.value);
		}

		var
			F = false,
			defaults = {
				value: 0, // set default value on initiation from `0` to `100` (percentage based)
				vertical: F,
				drag: function (value) {
					console.log(value);
				},
				step: 20 // set number from `0` to `100` or array [0,20,50,100]
			};

		for (var item in defaults) {
			if (typeof config[item] === 'undefined') {
				config[item] = defaults[item];
			}
		}


		var
			step = config.step,
			length = step.length,
			addEventListener = 'addEventListener',
			attachEvent = 'attachEvent',
			mouse = 'mouse',
			createElement = 'createElement',
			appendChild = 'appendChild',
			className = 'className',
			scrollTop = 'scrollTop',
			scrollLeft = 'scrollLeft',
			doc = document,
			body = doc.body,
			docElement = doc.documentElement,
			range = doc[createElement]('div'),
			drag = doc[createElement]('span'),
			down = F,
			rangeWidth, rangeOffset, dragWidth, cachePosition, woh, Position,
			isVertical = config.vertical,
			RangeClass = (isVertical ? 'Range_vertical' : 'Range'),
			Width = isVertical ? 'offsetHeight' : 'offsetWidth',
			Offset = isVertical ? 'offsetTop' : 'offsetLeft',
			Style = isVertical ? 'top' : 'left';

		elem[className] = RangeClass;
		range[className] = RangeClass + '__track';
		drag[className] = RangeClass + '__drag';

		on(range, mouse + 'down', function (e) {
			rangeWidth = range[Width];
			rangeOffset = range[Offset];
			dragWidth = drag[Width];
			down = true;
			updateDrag(e);
			return F;
		});

		on(doc, mouse + 'move', function (e) {
			updateDrag(e);
		});

		on(doc, mouse + 'up', function () {
			down = F;
		});

		on(window, 'resize', function () {
			woh = drag[Width];
			drag.style[Style] = (((cachePosition / 100) * range[Width]) - (woh / 2)) + 'px';
			down = F;
		});

		range[appendChild](drag);
		elem[appendChild](range);

		initDrag();

	}

	simple_range(document.getElementById('Range'), {
		value: 20,
		step: [0, 20, 50, 100]
	});

})();
