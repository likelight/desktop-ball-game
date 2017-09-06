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

    function setLeftScore(score) {
        var tenScore = 0;
        var singleScore = 0;
        singleScore = score % 10;
        tenScore = parseInt(score / 10);
        var url1 = './images/' + tenScore + '.png';
        var url2 = './images/' + singleScore + '.png';

        document.getElementById('scoreleft-ten').setAttribute('src', url1);
        document.getElementById('scoreleft-single').setAttribute('src', url2);
    }

    function setRightScore(score) {
        var tenScore = 0;
        var singleScore = 0;
        singleScore = score % 10;
        tenScore = parseInt(score / 10);
        var url1 = './images/' + tenScore + '.png';
        var url2 = './images/' + singleScore + '.png';

        document.getElementById('scoreright-ten').setAttribute('src', url1);
        document.getElementById('scoreright-single').setAttribute('src', url2);

    }

    var canvas = document.getElementById('match');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;

    var gameManager = {
        manifest: [
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
            }, {
                src: 'dice.png',
                id: 'ball'
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
            bg1.scaleY = canvas.height / (bg1.getBounds().height);
            bgContainer.addChild(bg1);

            var buttonContainer = new createjs.Container();

            var buttonImg = this.loader.getResult('button');
            var leftButton = new createjs.Bitmap(buttonImg);
            var rightButton = new createjs.Bitmap(buttonImg);
            leftButton.x = 10;
            leftButton.y = 170;

            rightButton.x = 850;
            rightButton.y = 170;
            rightButton.scaleX = leftButton.scaleX = canvas.width / bg1.getBounds().width;
            rightButton.scaleY = leftButton.scaleY = canvas.height / (bg1.getBounds().height);

            //this.stage.addChild(Rect);//添加子视图
            leftButton.addEventListener("mousedown", function (e) {
                var shape = e.target;
                shape.on('pressmove', function (t) {
                    shape.x = t.stageX;
                    shape.y = t.stageY;
                    this.stage.update();
                }.bind(this));

                shape.on("pressup", function(evt) {
                     shape.removeAllEventListeners();
                }.bind(this));

            }.bind(this));

            rightButton.addEventListener("mousedown", function (e) {
                var shape = e.target;
                shape.on('pressmove', function (t) {
                    shape.x = t.stageX;
                    shape.y = t.stageY;
                    this.stage.update();
                }.bind(this));

                shape.on("pressup", function(evt) {
                    shape.removeAllEventListeners();
                }.bind(this));

            }.bind(this));

            buttonContainer.addChild(leftButton);
            buttonContainer.addChild(rightButton);

            this.stage.addChild(bgContainer);
            this.stage.addChild(buttonContainer);
            this.stage.update();
        },
        startMove: function (e) {
            var shape = e.target;
            this.stage.addEventListener('stagemousemove', function (t) {
                console.log(t);
                shape.x = t.stageX;
                shape.y = t.stageY;
            });

        },
        startGame: function () {

        },
        stopGame: function () {

        }
    };


    window.gameManager = gameManager;
})(window, createjs);