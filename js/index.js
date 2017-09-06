(function (window, createjs) {
    function isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    var canvas = document.getElementById('match');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;

    var gameManager = {
        manifest: [
            {
                src: '0.png',
                id: 'num0'
            },
            {
                src: '1.png',
                id: 'num1'
            },
            {
                src: 'scoreboard-background.png',
                id: 'bg'
            },
            {
                src: 'board.jpg',
                id: 'board'
            }, {
                src: 'button.png',
                id: 'button'
            }, {
                src: 'court.png',
                id: 'court'
            }
        ],
        init: function () {
            this.loader = new createjs.LoadQueue();
            this.loader.addEventListener('complete', this.handleLoadComplete.bind(this));
            this.loader.loadManifest(this.manifest, true, './images/');
        },
        tick: function () {
        },
        handleLoadComplete: function () {
            this.stage = new createjs.Stage(canvas);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.setFPS(80);
            createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            createjs.Ticker.addEventListener("tick", this.tick.bind(this));

            var bgContainer = new createjs.Container();
            var bgResult = this.loader.getResult('court');
            var bg1 = new createjs.Bitmap(bgResult);
            bg1.x = bg1.y = 0;
            bg1.scaleX = canvas.width / bg1.getBounds().width;
            bg1.scaleY = canvas.height/ (bg1.getBounds().height);

            bgContainer.addChild(bg1);
            this.stage.addChild(bgContainer);

            this.stage.update();

        },
        startGame: function () {

        },
        stopGame: function () {
            
        }
    };



    window.gameManager = gameManager;
})(window, createjs);