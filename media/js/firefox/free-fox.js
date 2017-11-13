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

    function initVideoControls() {
        var tag = document.createElement('script');
        tag.id = 'video-control';
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = function () {
            window.player = new window.YT.Player('free-fox-embed-video', {
                events: {
                  'onReady': window.onPlayerReady,
                  'onStateChange': window.onPlayerStateChange
                }
            });
        };       
        window.onPlayerReady = function(e) {
            window.dataLayer.push({
                event: 'play-video',
                interaction: 'play',
                status: 'ready'
            });
        };
        window.onPlayerStateChange = function(e) {
            if (e.data == 0) {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'ended'
                });
            } else if (e.data == 1) {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'playing'
                });
            } else if (e.data == 2) {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'paused'
                });
            } 
        };
        var play = document.getElementById('video-play');
        play.onclick = function (e) {
            var thumb = document.getElementById('video-thumb');
            thumb.style.opacity = '0.0';
            thumb.style.pointerEvents = 'none';
            window.player.playVideo();
            window.dataLayer.push({
                event: 'play-video',
                interaction: 'play',
                status: 'start'
            });
        }
    }

    // Basic feature detect for 1st class JS features.
    if (cutsTheMustard()) {
        if (client.isMobile) {
            var url = new URL(window.location.href);
            var c = url.searchParams.get("utm_content");
            if (c) {
                window.location = 'https://app.adjust.com/' + c;
            } else {
                window.location = 'https://app.adjust.com/b8vfki';
            }
        }
        document.querySelector('main').className = 'supports-videos';
        initMediaQueries();
        initScrollTracking();
        initVideoControls();
        // initDownloadTracking();
    }

})(window.Mozilla, window.Waypoint);

