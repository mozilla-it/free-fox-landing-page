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
        var iframe = document.getElementById('free-fox-youtube');
        if (iframe) {
            var tag = document.createElement('script');
            tag.id = 'video-control';
            tag.src = 'https://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = function () {
                window.player = new window.YT.Player('free-fox-youtube', {
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
                    closeModal();
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
            document.addEventListener('keydown', function(e) {
                var evt = e || window.event;
                var isEscape = false;
                if ("key" in evt) {
                    isEscape = (evt.key == "Escape" || evt.key == "Esc");
                } else {
                    isEscape = (evt.keyCode == 27);
                }
                if (isEscape) {
                    window.dataLayer.push({
                        event: 'play-video',
                        interaction: 'play',
                        status: 'closed'
                    });
                    closeModal();
                }
            });
            $('.close-button').click(closeModal);
            var modal = document.getElementById('video-modal');
            var play = document.getElementById('video-play');
            function closeModal(e) {
                window.player.pauseVideo();
                window.player.seekTo(0.0);
                modal.style.opacity = '0.0';
                modal.style.pointerEvents = 'none';
            };
            modal.onclick = function() {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'closed'
                });
                closeModal();
            }
            play.onclick = function (e) {
                modal.style.opacity = '1.0';
                modal.style.pointerEvents = 'all';
                window.player.playVideo();
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'start'
                });
            };
        }
        iframe = document.getElementById('free-fox-vimeo');
        if (iframe) {
            var player = new Vimeo.Player(iframe);
            var play = document.getElementById('video-play');
            var modal = document.getElementById('video-modal');
            play.onclick = function (e) {
                modal.style.opacity = '1.0';
                modal.style.pointerEvents = 'all';
                player.play();
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'start'
                });
            };
            document.addEventListener('keydown', function(e) {
                var evt = e || window.event;
                var isEscape = false;
                if ("key" in evt) {
                    isEscape = (evt.key == "Escape" || evt.key == "Esc");
                } else {
                    isEscape = (evt.keyCode == 27);
                }
                if (isEscape) {
                    window.dataLayer.push({
                        event: 'play-video',
                        interaction: 'play',
                        status: 'closed'
                    });
                    closeModal();
                }
            });
            $('.close-button').click(closeModal);
            function closeModal(e) {
                player.pause().then(function() {
                    player.setCurrentTime(0.0);
                    modal.style.opacity = '0.0';
                    modal.style.pointerEvents = 'none';
                });
            };
            modal.onclick = function() {
                closeModal();
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'closed'
                });
            }
            player.on('play', function() {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'playing'
                });
            });
            player.on('pause', function() {
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'paused'
                });
            });
            player.on('ended', function() {
                closeModal();
                window.dataLayer.push({
                    event: 'play-video',
                    interaction: 'play',
                    status: 'ended'
                });
            });
        }
    
    }

    if (cutsTheMustard()) {
        if (/^(android|ios)$/.test(client.platform)) {
            var url = new URL(window.location.href);
            var c = url.searchParams.get('utm_content');
            var redirect = 'https://app.adjust.com/b8vfki';
            if (c) {
                redirect = 'https://app.adjust.com/' + c;
            }
            var fallbackLink = document.getElementById('fallback-link');
            fallbackLink.href = redirect;
            window.location = redirect;
        }
        document.querySelector('main').className = 'supports-videos';
        initMediaQueries();
        initScrollTracking();
        initVideoControls();
    }

})(window.Mozilla, window.Waypoint);

