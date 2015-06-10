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

		function updateDrag(event, forse) {
			event = event || window.event;
			Position = event.pageX;
			if (!Position) {
				Position = event.clientX + body[scrollLeft] + docElement[scrollLeft];
			}

			if (down && Position >= rangeOffset && Position <= (rangeOffset + rangeWidth)) {
				cachePosition = Math.round(((Position - rangeOffset) / rangeWidth) * 100);
				if (forse) {
					calcPosition();
					config.drag(cachePosition);
				} else {
					paint();
				}
			}
		}

		function calcPosition() {
			var i = 0, arr = [], obj = {}, rez, id = null;
			for (; i < length; i++) {
				if (cachePosition != step[i]) {
					if (cachePosition > step[i]) {
						rez = cachePosition - step[i];
					} else {
						rez = step[i] - cachePosition;
					}
					arr.push(rez);
					obj[rez] = i;
				} else {
					id = i;
					break;
				}
			}
			if (id === null) id = obj[Math.min.apply(null, arr)];
			cachePosition = step[id];
			paint();
			if (id === 0) {
				drag[className] = RangeClass + '__drag ' + RangeClass + '__drag_first';
			} else {
				if (id === length - 1) {
					drag[className] = RangeClass + '__drag ' + RangeClass + '__drag_last';
				} else {
					drag[className] = RangeClass + '__drag ';
				}
			}
		}

		function paint() {
			drag.style[Style] = ((cachePosition / 100) * rangeWidth - (dragWidth / 2)) + 'px';
		}

		function initDrag() {
			rangeWidth = range[Width];
			rangeOffset = range[Offset];
			dragWidth = drag[Width];
			cachePosition = config.value;
			calcPosition();
		}

		var
			F = false,
			defaults = {
				value: 0, // set default value on initiation from `0` to `100` (percentage based)
				drag: function (value) {
					console.log(value);
				},
				step: [0, 20, 50, 100]
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
			scrollLeft = 'scrollLeft',
			doc = document,
			body = doc.body,
			docElement = doc.documentElement,
			range = doc[createElement]('div'),
			drag = doc[createElement]('span'),
			down = F,
			cachePosition, woh, Position,
			RangeClass = 'Range',
			Width = 'offsetWidth',
			Offset = 'offsetLeft',
			Style = 'left',
			rangeWidth = range[Width],
			rangeOffset = range[Offset],
			dragWidth = drag[Width];

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

		on(doc, mouse + 'up', function (e) {
			updateDrag(e, true);
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
		value: 100,
		step: [0, 20, 49, 100]
	});

})();
