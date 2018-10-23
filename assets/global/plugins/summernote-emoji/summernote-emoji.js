(function(factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {

    /**
     * @class plugin.emoji
     *
     * Initialize in the toolbar like so:
     *   toolbar: ['insert', ['emojiList']]
     *
     * Emoji Plugin
     */
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'emojiList': function(context) {
            var self = this;

            // ui has renders to build ui elements.
            //  - you can create a button with `ui.button`
            var ui = $.summernote.ui;

            // add emoji button
            context.memo('button.emojiList', function() {
                // generate all the emojis
                var list = "";
                for (i = 0; i < emojis.length; i++) {
                    list += '<i class="' + emojis[i] + ' twa-lg"></i>';
                }

                var $emojiList = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: '<span class="twa twa-smile"></span> <span class="caret"></span>',
                        tooltip: "اموجی",
                        data: {
                            toggle: 'dropdown'
                        },
                        click: function () {
                            context.invoke('editor.saveRange');
                        }
                    }),
                    ui.dropdown({
                        className: 'dropdown-style emoji-list',
                        //items: emojis, // list of style tag
                        contents: list,
                        callback: function($dropdown) {
                            $dropdown.find('i').each(function() {
                                $(this).click(function() {
                                    addimg($(this).attr("class"));
                                });
                            });
                        }
                    })
                ]).render();
                return $emojiList;
            });

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function(we, e) {

                    //console.log('summernote initialized', we, e);
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function(we, e) {

                    //console.log('summernote keyup', we, e);
                }
            };

            // This methods will be called when editor is destroyed by $('..').summernote('destroy');
            // You should remove elements on `initialize`.
            this.destroy = function() {

            };

            function addimg(value) {
                var temp = value.split(' ');
                var className = temp[1];
                var src = $(`.${className}`).css('background-image').slice(4, -1).replace(/"/g, "");
                var code = src.split('/').pop().split('.')[0];
                var pattern = '&#x' + code;
                var node = $(`<span>${pattern}</span>`);
                context.invoke('editor.restoreRange');
                context.invoke('editor.focus');
                context.invoke("editor.insertNode", node[0]);
            }
        }
    });

    var emojis = [
        // http://ellekasai.github.io/twemoji-awesome/
        "twa twa-smile",
        "twa twa-laughing",
        "twa twa-blush",
        "twa twa-smiley",
        "twa twa-relaxed",
        "twa twa-smirk",
        "twa twa-heart-eyes",
        "twa twa-kissing-heart",
        "twa twa-kissing-closed-eyes",
        "twa twa-flushed",
        "twa twa-relieved",
        "twa twa-satisfied",
        "twa twa-grin",
        "twa twa-wink",
        "twa twa-stuck-out-tongue-winking-eye",
        "twa twa-stuck-out-tongue-closed-eyes",
        "twa twa-grinning",
        "twa twa-kissing",
        "twa twa-kissing-smiling-eyes",
        "twa twa-stuck-out-tongue",
        "twa twa-sleeping",
        "twa twa-worried",
        "twa twa-frowning",
        "twa twa-anguished",
        "twa twa-open-mouth",
        "twa twa-grimacing",
        "twa twa-confused",
        "twa twa-hushed",
        "twa twa-expressionless",
        "twa twa-unamused",
        "twa twa-sweat-smile",
        "twa twa-sweat",
        "twa twa-weary",
        "twa twa-pensive",
        "twa twa-disappointed",
        "twa twa-confounded",
        "twa twa-fearful",
        "twa twa-cold-sweat",
        "twa twa-persevere",
        "twa twa-cry",
        "twa twa-sob",
        "twa twa-joy",
        "twa twa-astonished",
        "twa twa-scream",
        "twa twa-tired-face",
        "twa twa-angry",
        "twa twa-rage",
        "twa twa-triumph",
        "twa twa-sleepy",
        "twa twa-yum",
        "twa twa-mask",
        "twa twa-sunglasses",
        "twa twa-dizzy-face",
        "twa twa-imp",
        "twa twa-smiling-imp",
        "twa twa-neutral-face",
        "twa twa-no-mouth",
        "twa twa-innocent",
        "twa twa-alien",
        "twa twa-yellow-heart",
        "twa twa-blue-heart",
        "twa twa-purple-heart",
        "twa twa-heart",
        "twa twa-green-heart",
        "twa twa-broken-heart",
        "twa twa-heartbeat",
        "twa twa-heartpulse",
        "twa twa-two-hearts",
        "twa twa-revolving-hearts",
        "twa twa-cupid",
        "twa twa-sparkling-heart",
        "twa twa-sparkles",
        "twa twa-star",
        "twa twa-star2",
        "twa twa-dizzy",
        "twa twa-boom",
        "twa twa-anger",
        "twa twa-exclamation",
        "twa twa-question",
        "twa twa-grey-exclamation",
        "twa twa-grey-question",
        "twa twa-zzz",
        "twa twa-dash",
        "twa twa-sweat-drops",
        "twa twa-notes",
        "twa twa-musical-note",
        "twa twa-fire",
        "twa twa-poop",
        "twa twa-thumbsup",
        "twa twa-thumbsdown",
        "twa twa-ok-hand",
        "twa twa-punch",
        "twa twa-fist",
        "twa twa-v",
        "twa twa-wave",
        "twa twa-hand",
        "twa twa-open-hands",
        "twa twa-point-up",
        "twa twa-point-down",
        "twa twa-point-left",
        "twa twa-point-right",
        "twa twa-raised-hands",
        "twa twa-pray",
        "twa twa-point-up-2",
        "twa twa-clap",
        "twa twa-muscle",
        "twa twa-walking",
        "twa twa-runner",
        "twa twa-couple",
        "twa twa-family",
        "twa twa-two-men-holding-hands",
        "twa twa-two-women-holding-hands",
        "twa twa-dancer",
        "twa twa-dancers",
        "twa twa-ok-woman",
        "twa twa-no-good",
        "twa twa-information-desk-person",
        "twa twa-raised-hand",
        "twa twa-bride-with-veil",
        "twa twa-person-with-pouting-face",
        "twa twa-person-frowning",
        "twa twa-bow",
        "twa twa-couplekiss",
        "twa twa-couple-with-heart",
        "twa twa-massage",
        "twa twa-haircut",
        "twa twa-nail-care",
        "twa twa-boy",
        "twa twa-girl",
        "twa twa-woman",
        "twa twa-man",
        "twa twa-baby",
        "twa twa-older-woman",
        "twa twa-older-man",
        "twa twa-person-with-blond-hair",
        "twa twa-man-with-gua-pi-mao",
        "twa twa-man-with-turban",
        "twa twa-construction-worker",
        "twa twa-cop",
        "twa twa-angel",
        "twa twa-princess",
        "twa twa-smiley-cat",
        "twa twa-smile-cat",
        "twa twa-heart-eyes-cat",
        "twa twa-kissing-cat",
        "twa twa-smirk-cat",
        "twa twa-scream-cat",
        "twa twa-crying-cat-face",
        "twa twa-joy-cat",
        "twa twa-pouting-cat",
        "twa twa-japanese-ogre",
        "twa twa-japanese-goblin",
        "twa twa-see-no-evil",
        "twa twa-hear-no-evil",
        "twa twa-speak-no-evil",
        "twa twa-guardsman",
        "twa twa-skull",
        "twa twa-feet",
        "twa twa-lips",
        "twa twa-kiss",
        "twa twa-droplet",
        "twa twa-ear",
        "twa twa-eyes",
        "twa twa-nose",
        "twa twa-tongue",
        "twa twa-love-letter",
        "twa twa-bust-in-silhouette",
        "twa twa-busts-in-silhouette",
        "twa twa-speech-balloon",
        "twa twa-thought-balloon",
        "twa twa-sunny",
        "twa twa-umbrella",
        "twa twa-cloud",
        "twa twa-snowflake",
        "twa twa-snowman",
        "twa twa-zap",
        "twa twa-cyclone",
        "twa twa-foggy",
        "twa twa-ocean",
        "twa twa-cat",
        "twa twa-dog",
        "twa twa-mouse",
        "twa twa-hamster",
        "twa twa-rabbit",
        "twa twa-wolf",
        "twa twa-frog",
        "twa twa-tiger",
        "twa twa-koala",
        "twa twa-bear",
        "twa twa-pig",
        "twa twa-pig-nose",
        "twa twa-cow",
        "twa twa-boar",
        "twa twa-monkey-face",
        "twa twa-monkey",
        "twa twa-horse",
        "twa twa-racehorse",
        "twa twa-camel",
        "twa twa-sheep",
        "twa twa-elephant",
        "twa twa-panda-face",
        "twa twa-snake",
        "twa twa-bird",
        "twa twa-baby-chick",
        "twa twa-hatched-chick",
        "twa twa-hatching-chick",
        "twa twa-chicken",
        "twa twa-penguin",
        "twa twa-turtle",
        "twa twa-bug",
        "twa twa-honeybee",
        "twa twa-ant",
        "twa twa-beetle",
        "twa twa-snail",
        "twa twa-octopus",
        "twa twa-tropical-fish",
        "twa twa-fish",
        "twa twa-whale",
        "twa twa-whale2",
        "twa twa-dolphin",
        "twa twa-cow2",
        "twa twa-ram",
        "twa twa-rat",
        "twa twa-water-buffalo",
        "twa twa-tiger2",
        "twa twa-rabbit2",
        "twa twa-dragon",
        "twa twa-goat",
        "twa twa-rooster",
        "twa twa-dog2",
        "twa twa-pig2",
        "twa twa-mouse2",
        "twa twa-ox",
        "twa twa-dragon-face",
        "twa twa-blowfish",
        "twa twa-crocodile",
        "twa twa-dromedary-camel",
        "twa twa-leopard",
        "twa twa-cat2",
        "twa twa-poodle",
        "twa twa-paw-prints",
        "twa twa-bouquet",
        "twa twa-cherry-blossom",
        "twa twa-tulip",
        "twa twa-four-leaf-clover",
        "twa twa-rose",
        "twa twa-sunflower",
        "twa twa-hibiscus",
        "twa twa-maple-leaf",
        "twa twa-leaves",
        "twa twa-fallen-leaf",
        "twa twa-herb",
        "twa twa-mushroom",
        "twa twa-cactus",
        "twa twa-palm-tree",
        "twa twa-evergreen-tree",
        "twa twa-deciduous-tree",
        "twa twa-chestnut",
        "twa twa-seedling",
        "twa twa-blossom",
        "twa twa-ear-of-rice",
        "twa twa-shell",
        "twa twa-globe-with-meridians",
        "twa twa-sun-with-face",
        "twa twa-full-moon-with-face",
        "twa twa-new-moon-with-face",
        "twa twa-new-moon",
        "twa twa-waxing-crescent-moon",
        "twa twa-first-quarter-moon",
        "twa twa-waxing-gibbous-moon",
        "twa twa-full-moon",
        "twa twa-waning-gibbous-moon",
        "twa twa-last-quarter-moon",
        "twa twa-waning-crescent-moon",
        "twa twa-last-quarter-moon-with-face",
        "twa twa-first-quarter-moon-with-face",
        "twa twa-moon",
        "twa twa-earth-africa",
        "twa twa-earth-americas",
        "twa twa-earth-asia",
        "twa twa-volcano",
        "twa twa-milky-way",
        "twa twa-partly-sunny",
        "twa twa-bamboo",
        "twa twa-gift-heart",
        "twa twa-dolls",
        "twa twa-school-satchel",
        "twa twa-mortar-board",
        "twa twa-flags",
        "twa twa-fireworks",
        "twa twa-sparkler",
        "twa twa-wind-chime",
        "twa twa-rice-scene",
        "twa twa-jack-o-lantern",
        "twa twa-ghost",
        "twa twa-santa",
        "twa twa-8ball",
        "twa twa-alarm-clock",
        "twa twa-apple",
        "twa twa-art",
        "twa twa-baby-bottle",
        "twa twa-balloon",
        "twa twa-banana",
        "twa twa-bar-chart",
        "twa twa-baseball",
        "twa twa-basketball",
        "twa twa-bath",
        "twa twa-bathtub",
        "twa twa-battery",
        "twa twa-beer",
        "twa twa-beers",
        "twa twa-bell",
        "twa twa-bento",
        "twa twa-bicyclist",
        "twa twa-bikini",
        "twa twa-birthday",
        "twa twa-black-joker",
        "twa twa-black-nib",
        "twa twa-blue-book",
        "twa twa-bomb",
        "twa twa-bookmark",
        "twa twa-bookmark-tabs",
        "twa twa-books",
        "twa twa-boot",
        "twa twa-bowling",
        "twa twa-bread",
        "twa twa-briefcase",
        "twa twa-bulb",
        "twa twa-cake",
        "twa twa-calendar",
        "twa twa-calling",
        "twa twa-camera",
        "twa twa-candy",
        "twa twa-card-index",
        "twa twa-cd",
        "twa twa-chart-with-downwards-trend",
        "twa twa-chart-with-upwards-trend",
        "twa twa-cherries",
        "twa twa-chocolate-bar",
        "twa twa-christmas-tree",
        "twa twa-clapper",
        "twa twa-clipboard",
        "twa twa-closed-book",
        "twa twa-closed-lock-with-key",
        "twa twa-closed-umbrella",
        "twa twa-clubs",
        "twa twa-cocktail",
        "twa twa-coffee",
        "twa twa-computer",
        "twa twa-confetti-ball",
        "twa twa-cookie",
        "twa twa-corn",
        "twa twa-credit-card",
        "twa twa-crown",
        "twa twa-crystal-ball",
        "twa twa-curry",
        "twa twa-custard",
        "twa twa-dango",
        "twa twa-dart",
        "twa twa-date",
        "twa twa-diamonds",
        "twa twa-dollar",
        "twa twa-door",
        "twa twa-doughnut",
        "twa twa-dress",
        "twa twa-dvd",
        "twa twa-e-mail",
        "twa twa-egg",
        "twa twa-eggplant",
        "twa twa-electric-plug",
        "twa twa-email",
        "twa twa-euro",
        "twa twa-eyeglasses",
        "twa twa-fax",
        "twa twa-file-folder",
        "twa twa-fish-cake",
        "twa twa-fishing-pole-and-fish",
        "twa twa-flashlight",
        "twa twa-floppy-disk",
        "twa twa-flower-playing-cards",
        "twa twa-football",
        "twa twa-fork-and-knife",
        "twa twa-fried-shrimp",
        "twa twa-fries",
        "twa twa-game-die",
        "twa twa-gem",
        "twa twa-gift",
        "twa twa-golf",
        "twa twa-grapes",
        "twa twa-green-apple",
        "twa twa-green-book",
        "twa twa-guitar",
        "twa twa-gun",
        "twa twa-hamburger",
        "twa twa-hammer",
        "twa twa-handbag",
        "twa twa-headphones",
        "twa twa-hearts",
        "twa twa-high-brightness",
        "twa twa-high-heel",
        "twa twa-hocho",
        "twa twa-honey-pot",
        "twa twa-horse-racing",
        "twa twa-hourglass",
        "twa twa-hourglass-flowing-sand",
        "twa twa-ice-cream",
        "twa twa-icecream",
        "twa twa-inbox-tray",
        "twa twa-incoming-envelope",
        "twa twa-iphone",
        "twa twa-jeans",
        "twa twa-key",
        "twa twa-kimono",
        "twa twa-ledger",
        "twa twa-lemon",
        "twa twa-lipstick",
        "twa twa-lock",
        "twa twa-lock-with-ink-pen",
        "twa twa-lollipop",
        "twa twa-loop",
        "twa twa-loudspeaker",
        "twa twa-low-brightness",
        "twa twa-mag",
        "twa twa-mag-right",
        "twa twa-mahjong",
        "twa twa-mailbox",
        "twa twa-mailbox-closed",
        "twa twa-mailbox-with-mail",
        "twa twa-mailbox-with-no-mail",
        "twa twa-mans-shoe",
        "twa twa-meat-on-bone",
        "twa twa-mega",
        "twa twa-melon",
        "twa twa-memo",
        "twa twa-microphone",
        "twa twa-microscope",
        "twa twa-minidisc",
        "twa twa-money-with-wings",
        "twa twa-moneybag",
        "twa twa-mountain-bicyclist",
        "twa twa-movie-camera",
        "twa twa-musical-keyboard",
        "twa twa-musical-score",
        "twa twa-mute",
        "twa twa-name-badge",
        "twa twa-necktie",
        "twa twa-newspaper",
        "twa twa-no-bell",
        "twa twa-notebook",
        "twa twa-notebook-with-decorative-cover",
        "twa twa-nut-and-bolt",
        "twa twa-oden",
        "twa twa-open-file-folder",
        "twa twa-orange-book",
        "twa twa-outbox-tray",
        "twa twa-page-facing-up",
        "twa twa-page-with-curl",
        "twa twa-pager",
        "twa twa-paperclip",
        "twa twa-peach",
        "twa twa-pear",
        "twa twa-pencil2",
        "twa twa-phone",
        "twa twa-pill",
        "twa twa-pineapple",
        "twa twa-pizza",
        "twa twa-postal-horn",
        "twa twa-postbox",
        "twa twa-pouch",
        "twa twa-poultry-leg",
        "twa twa-pound",
        "twa twa-purse",
        "twa twa-pushpin",
        "twa twa-radio",
        "twa twa-ramen",
        "twa twa-ribbon",
        "twa twa-rice",
        "twa twa-rice-ball",
        "twa twa-rice-cracker",
        "twa twa-ring",
        "twa twa-rugby-football",
        "twa twa-running-shirt-with-sash",
        "twa twa-sake",
        "twa twa-sandal",
        "twa twa-satellite",
        "twa twa-saxophone",
        "twa twa-scissors",
        "twa twa-scroll",
        "twa twa-seat",
        "twa twa-shaved-ice",
        "twa twa-shirt",
        "twa twa-shower",
        "twa twa-ski",
        "twa twa-smoking",
        "twa twa-snowboarder",
        "twa twa-soccer",
        "twa twa-sound",
        "twa twa-space-invader",
        "twa twa-spades",
        "twa twa-spaghetti",
        "twa twa-speaker",
        "twa twa-stew",
        "twa twa-straight-ruler",
        "twa twa-strawberry",
        "twa twa-surfer",
        "twa twa-sushi",
        "twa twa-sweet-potato",
        "twa twa-swimmer",
        "twa twa-syringe",
        "twa twa-tada",
        "twa twa-tanabata-tree",
        "twa twa-tangerine",
        "twa twa-tea",
        "twa twa-telephone-receiver",
        "twa twa-telescope",
        "twa twa-tennis",
        "twa twa-toilet",
        "twa twa-tomato",
        "twa twa-tophat",
        "twa twa-triangular-ruler",
        "twa twa-trophy",
        "twa twa-tropical-drink",
        "twa twa-trumpet",
        "twa twa-tv",
        "twa twa-unlock",
        "twa twa-vhs",
        "twa twa-video-camera",
        "twa twa-video-game",
        "twa twa-violin",
        "twa twa-watch",
        "twa twa-watermelon",
        "twa twa-wine-glass",
        "twa twa-womans-clothes",
        "twa twa-womans-hat",
        "twa twa-wrench",
        "twa twa-yen",
        "twa twa-aerial-tramway",
        "twa twa-airplane",
        "twa twa-ambulance",
        "twa twa-anchor",
        "twa twa-articulated-lorry",
        "twa twa-atm",
        "twa twa-bank",
        "twa twa-barber",
        "twa twa-beginner",
        "twa twa-bike",
        "twa twa-blue-car",
        "twa twa-boat",
        "twa twa-bridge-at-night",
        "twa twa-bullettrain-front",
        "twa twa-bullettrain-side",
        "twa twa-bus",
        "twa twa-busstop",
        "twa twa-car",
        "twa twa-carousel-horse",
        "twa twa-checkered-flag",
        "twa twa-church",
        "twa twa-circus-tent",
        "twa twa-city-sunrise",
        "twa twa-city-sunset",
        "twa twa-construction",
        "twa twa-convenience-store",
        "twa twa-crossed-flags",
        "twa twa-department-store",
        "twa twa-european-castle",
        "twa twa-european-post-office",
        "twa twa-factory",
        "twa twa-ferris-wheel",
        "twa twa-fire-engine",
        "twa twa-fountain",
        "twa twa-fuelpump",
        "twa twa-helicopter",
        "twa twa-hospital",
        "twa twa-hotel",
        "twa twa-hotsprings",
        "twa twa-house",
        "twa twa-house-with-garden",
        "twa twa-japan",
        "twa twa-japanese-castle",
        "twa twa-light-rail",
        "twa twa-love-hotel",
        "twa twa-minibus",
        "twa twa-monorail",
        "twa twa-mount-fuji",
        "twa twa-mountain-cableway",
        "twa twa-mountain-railway",
        "twa twa-moyai",
        "twa twa-office",
        "twa twa-oncoming-automobile",
        "twa twa-oncoming-bus",
        "twa twa-oncoming-police-car",
        "twa twa-oncoming-taxi",
        "twa twa-performing-arts",
        "twa twa-police-car",
        "twa twa-post-office",
        "twa twa-railway-car",
        "twa twa-rainbow",
        "twa twa-rocket",
        "twa twa-roller-coaster",
        "twa twa-rotating-light",
        "twa twa-round-pushpin",
        "twa twa-rowboat",
        "twa twa-school",
        "twa twa-ship",
        "twa twa-slot-machine",
        "twa twa-speedboat",
        "twa twa-stars",
        "twa twa-station",
        "twa twa-statue-of-liberty",
        "twa twa-steam-locomotive",
        "twa twa-sunrise",
        "twa twa-sunrise-over-mountains",
        "twa twa-suspension-railway",
        "twa twa-taxi",
        "twa twa-tent",
        "twa twa-ticket",
        "twa twa-tokyo-tower",
        "twa twa-tractor",
        "twa twa-traffic-light",
        "twa twa-train2",
        "twa twa-tram",
        "twa twa-triangular-flag-on-post",
        "twa twa-trolleybus",
        "twa twa-truck",
        "twa twa-vertical-traffic-light",
        "twa twa-warning",
        "twa twa-wedding",
        "twa twa-jp",
        "twa twa-kr",
        "twa twa-cn",
        "twa twa-us",
        "twa twa-fr",
        "twa twa-es",
        "twa twa-it",
        "twa twa-ru",
        "twa twa-gb",
        "twa twa-de",
        "twa twa-100",
        "twa twa-1234",
        "twa twa-a",
        "twa twa-ab",
        "twa twa-abc",
        "twa twa-abcd",
        "twa twa-accept",
        "twa twa-aquarius",
        "twa twa-aries",
        "twa twa-arrow-backward",
        "twa twa-arrow-double-down",
        "twa twa-arrow-double-up",
        "twa twa-arrow-down",
        "twa twa-arrow-down-small",
        "twa twa-arrow-forward",
        "twa twa-arrow-heading-down",
        "twa twa-arrow-heading-up",
        "twa twa-arrow-left",
        "twa twa-arrow-lower-left",
        "twa twa-arrow-lower-right",
        "twa twa-arrow-right",
        "twa twa-arrow-right-hook",
        "twa twa-arrow-up",
        "twa twa-arrow-up-down",
        "twa twa-arrow-up-small",
        "twa twa-arrow-upper-left",
        "twa twa-arrow-upper-right",
        "twa twa-arrows-clockwise",
        "twa twa-arrows-counterclockwise",
        "twa twa-b",
        "twa twa-baby-symbol",
        "twa twa-baggage-claim",
        "twa twa-ballot-box-with-check",
        "twa twa-bangbang",
        "twa twa-black-circle",
        "twa twa-black-square-button",
        "twa twa-cancer",
        "twa twa-capital-abcd",
        "twa twa-capricorn",
        "twa twa-chart",
        "twa twa-children-crossing",
        "twa twa-cinema",
        "twa twa-cl",
        "twa twa-clock1",
        "twa twa-clock10",
        "twa twa-clock1030",
        "twa twa-clock11",
        "twa twa-clock1130",
        "twa twa-clock12",
        "twa twa-clock1230",
        "twa twa-clock130",
        "twa twa-clock2",
        "twa twa-clock230",
        "twa twa-clock3",
        "twa twa-clock330",
        "twa twa-clock4",
        "twa twa-clock430",
        "twa twa-clock5",
        "twa twa-clock530",
        "twa twa-clock6",
        "twa twa-clock630",
        "twa twa-clock7",
        "twa twa-clock730",
        "twa twa-clock8",
        "twa twa-clock830",
        "twa twa-clock9",
        "twa twa-clock930",
        "twa twa-congratulations",
        "twa twa-cool",
        "twa twa-copyright",
        "twa twa-curly-loop",
        "twa twa-currency-exchange",
        "twa twa-customs",
        "twa twa-diamond-shape-with-a-dot-inside",
        "twa twa-do-not-litter",
        "twa twa-eight",
        "twa twa-eight-pointed-black-star",
        "twa twa-eight-spoked-asterisk",
        "twa twa-end",
        "twa twa-fast-forward",
        "twa twa-five",
        "twa twa-four",
        "twa twa-free",
        "twa twa-gemini",
        "twa twa-hash",
        "twa twa-heart-decoration",
        "twa twa-heavy-check-mark",
        "twa twa-heavy-division-sign",
        "twa twa-heavy-dollar-sign",
        "twa twa-heavy-minus-sign",
        "twa twa-heavy-multiplication-x",
        "twa twa-heavy-plus-sign",
        "twa twa-id",
        "twa twa-ideograph-advantage",
        "twa twa-information-source",
        "twa twa-interrobang",
        "twa twa-keycap-ten",
        "twa twa-koko",
        "twa twa-large-blue-circle",
        "twa twa-large-blue-diamond",
        "twa twa-large-orange-diamond",
        "twa twa-left-luggage",
        "twa twa-left-right-arrow",
        "twa twa-leftwards-arrow-with-hook",
        "twa twa-leo",
        "twa twa-libra",
        "twa twa-link",
        "twa twa-m",
        "twa twa-mens",
        "twa twa-metro",
        "twa twa-mobile-phone-off",
        "twa twa-negative-squared-cross-mark",
        "twa twa-new",
        "twa twa-ng",
        "twa twa-nine",
        "twa twa-no-bicycles",
        "twa twa-no-entry",
        "twa twa-no-entry-sign",
        "twa twa-no-mobile-phones",
        "twa twa-no-pedestrians",
        "twa twa-no-smoking",
        "twa twa-non-potable-water",
        "twa twa-o",
        "twa twa-o2",
        "twa twa-ok",
        "twa twa-on",
        "twa twa-one",
        "twa twa-ophiuchus",
        "twa twa-parking",
        "twa twa-part-alternation-mark",
        "twa twa-passport-control",
        "twa twa-pisces",
        "twa twa-potable-water",
        "twa twa-put-litter-in-its-place",
        "twa twa-radio-button",
        "twa twa-recycle",
        "twa twa-red-circle",
        "twa twa-registered",
        "twa twa-repeat",
        "twa twa-repeat-one",
        "twa twa-restroom",
        "twa twa-rewind",
        "twa twa-sa",
        "twa twa-sagittarius",
        "twa twa-scorpius",
        "twa twa-secret",
        "twa twa-seven",
        "twa twa-signal-strength",
        "twa twa-six",
        "twa twa-six-pointed-star",
        "twa twa-small-blue-diamond",
        "twa twa-small-orange-diamond",
        "twa twa-small-red-triangle",
        "twa twa-small-red-triangle-down",
        "twa twa-soon",
        "twa twa-sos",
        "twa twa-symbols",
        "twa twa-taurus",
        "twa twa-three",
        "twa twa-tm",
        "twa twa-top",
        "twa twa-trident",
        "twa twa-twisted-rightwards-arrows",
        "twa twa-two",
        "twa twa-u5272",
        "twa twa-u5408",
        "twa twa-u55b6",
        "twa twa-u6307",
        "twa twa-u6708",
        "twa twa-u6709",
        "twa twa-u6e80",
        "twa twa-u7121",
        "twa twa-u7533",
        "twa twa-u7981",
        "twa twa-u7a7a",
        "twa twa-underage",
        "twa twa-up",
        "twa twa-vibration-mode",
        "twa twa-virgo",
        "twa twa-vs",
        "twa twa-wavy-dash",
        "twa twa-wc",
        "twa twa-wheelchair",
        "twa twa-white-check-mark",
        "twa twa-white-circle",
        "twa twa-white-flower",
        "twa twa-white-square-button",
        "twa twa-womens",
        "twa twa-x",
        "twa twa-zero"
    ];
}));
