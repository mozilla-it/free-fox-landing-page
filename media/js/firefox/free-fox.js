/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (Mozilla, Waypoint) {
    'use strict';

    var client = Mozilla.Client;

    function cutsTheMustard() {
        return 'querySelector' in document &&
               'querySelectorAll' in document &&
               'addEventListener' in window &&
               typeof window.matchMedia !== 'undefined' &&
               typeof HTMLMediaElement !== 'undefined';
    }

    // Scroll waypoints for GA tracking.
    function initScrollTracking() {
        var sections = document.querySelectorAll('[data-scroll-tracking]');

        for (var i = 0; i < sections.length; i++) {
            new Waypoint({
                element: sections[i],
                handler: function(direction) {
                    if (direction === 'down') {
                        window.dataLayer.push({
                            event: 'scroll-section',
                            interaction: 'scroll',
                            section: this.element.getAttribute('data-scroll-tracking')
                        });
                    }
                },
                offset: '100%'
            });
        }
    }

    // Only init video carousel for wide viewports on desktop browsers.
    function initMediaQueries() {
        var desktopWidth;

        desktopWidth = matchMedia('(min-width: 1000px)');

        if (desktopWidth.matches) {
        }

        desktopWidth.addListener(function(mq) {
            if (mq.matches) {
            } else {
            }
        });
    }

 

    // Basic feature detect for 1st class JS features.
    if (cutsTheMustard()) {
        document.querySelector('main').className = 'supports-videos';
        initMediaQueries();
        initScrollTracking();
    }

})(window.Mozilla, window.Waypoint);
