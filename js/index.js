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

    var clientRect = canvas.getBoundingClientRect();
    var directionX = 1;
    var directionY = 1;

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
        initScore: function () {
            this.leftScore = 0;
            this.rightScore = 0;
            setLeftScore(this.leftScore);
            setRightScore(this.rightScore);
        },
        tick: function (e) {
            // 判断是否进球
            var result = this.checkIsGetScore();
            if (result) {
                // 左边被进球, 右边得分
                if (result === 1) {
                    this.rightScore ++;
                    if (this.rightScore <= 99) {
                        setRightScore(this.rightScore);
                    } else {
                        this.rightScore = 0;
                        setRightScore(this.rightScore);
                    }
                } else if ( result === 2) {
                    // 右边被进球,左边得分
                    this.leftScore ++;
                    if (this.leftScore <= 99) {
                        setLeftScore(this.leftScore);
                    } else {
                        this.leftScore = 0;
                        setLeftScore(this.leftScore);
                    }
                }

                this.removeEvent();
                this.initStart();
                this.initEvent();
                this.stage.update();
                return;
            }

            // 判断是否与button相撞
            var leftIntersection = ndgmr.checkPixelCollision(this.ball, this.leftButton, 0);
            var rightIntersection = ndgmr.checkPixelCollision(this.ball, this.rightButton, 0);

            if (leftIntersection) {
                var xDistance = this.lastLeftButtonStyle.x - this.leftButtonShape.x;
                var yDistance = this.lastLeftButtonStyle.y - this.leftButtonShape.y;
                var angle = Math.atan(yDistance/xDistance);
                var ballStyle = this.ball.getTransformedBounds();
                this.ball.isMoving = true;
            }

            // 球继续运动
            if (this.ball.isMoving) {
                this.ball.x += 6 * directionX;
                this.ball.y += 6 * directionY;

                if (this.ball.x < 0) {
                    directionX = 1;
                }
                if (this.ball.x > clientRect.width - this.ball.width / 2) {
                    directionX = -1;
                }
                if (this.ball.y > clientRect.height - this.ball.height / 2) {
                    directionY = -1;
                }
                if (this.ball.y < 0) {
                    directionY = 1;
                }

                this.stage.update();
            }

        },
        initStart: function () {
            this.leftButton.x = 0.1 * clientRect.width;
            this.leftButton.y = 0.5 * clientRect.height - this.leftButton.getBounds().height * 0.5;
            this.rightButton.x = 0.8 * clientRect.width;
            this.rightButton.y = 0.5 * clientRect.height - this.rightButton.getBounds().height * 0.5;
            this.ball.x = 0.5 * clientRect.width - 0.5 * this.ball.width;
            this.ball.y = 0.5 * clientRect.height - 0.5 * this.ball.height;
            this.ball.isMoving = false;
            this.ball.vx = 0;
            this.ball.vy = 0;
            directionX = 1;
            directionY = 1;
        },
        removeEvent: function () {
            this.leftButton.removeAllEventListeners();
            this.rightButton.removeAllEventListeners();
        },
        initEvent: function () {
            this.leftButton.addEventListener("mousedown", function (e) {
                this.lastLeftButtonStyle = this.leftButton.getTransformedBounds();
                var initLeftButtonStyle = this.leftButton.getTransformedBounds();
                var initEvtStyle = {
                    x: e.stageX,
                    y: e.stageY
                };
                var shape = this.leftButtonShape = e.target;
                shape.on('pressmove', function (t) {
                    shape.x = t.stageX - (initEvtStyle.x - initLeftButtonStyle.x);
                    shape.y = t.stageY - (initEvtStyle.y - initLeftButtonStyle.y);

                    var leftLimit = 20;
                    var rightLimit = 0.5 * clientRect.width - initLeftButtonStyle.width;
                    var topLimit = 12;
                    var bottomLimit = clientRect.height - initLeftButtonStyle.height - 12;

                    if (shape.x < leftLimit) {
                        shape.x = leftLimit;
                    }
                    if (shape.x > rightLimit) {
                        shape.x = rightLimit;
                    }
                    if (shape.y < topLimit) {
                        shape.y = topLimit;
                    }
                    if (shape.y > bottomLimit) {
                        shape.y = bottomLimit;
                    }

                    this.stage.update();
                }.bind(this));

                shape.on("pressup", function(evt) {
                    this.lastLeftButtonStyle = shape.getTransformedBounds();
                }.bind(this));

            }.bind(this));

            this.rightButton.addEventListener("mousedown", function (e) {
                var rightButtonStyle = this.rightButton.getTransformedBounds();
                var initEvtStyle = {
                    x: e.stageX,
                    y: e.stageY
                };
                var shape = this.rightButtonShape = e.target;
                shape.on('pressmove', function (t) {
                    shape.x = t.stageX - (initEvtStyle.x - rightButtonStyle.x);
                    shape.y = t.stageY - (initEvtStyle.y - rightButtonStyle.y);

                    var leftLimit = 0.5 * clientRect.width;
                    var rightLimit = clientRect.width - rightButtonStyle.width - 15;
                    var topLimit = 12;
                    var bottomLimit = clientRect.height - rightButtonStyle.height - 12;

                    if (shape.x < leftLimit) {
                        shape.x = leftLimit;
                    }
                    if (shape.x > rightLimit) {
                        shape.x = rightLimit;
                    }
                    if (shape.y < topLimit) {
                        shape.y = topLimit;
                    }
                    if (shape.y > bottomLimit) {
                        shape.y = bottomLimit;
                    }

                    this.stage.update();
                }.bind(this));

                shape.on("pressup", function(evt) {
                    // shape.removeAllEventListeners();
                }.bind(this));

            }.bind(this));
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
            this.leftButton = new createjs.Bitmap(buttonImg);
            this.rightButton = new createjs.Bitmap(buttonImg);

            this.rightButton.scaleX = this.leftButton.scaleX = canvas.width / bg1.getBounds().width;
            this.rightButton.scaleY = this.leftButton.scaleY = canvas.height / bg1.getBounds().height;
            //
            // this.leftButton.x = 0.1 * clientRect.width;
            // this.leftButton.y = 0.5 * clientRect.height - this.leftButton.getBounds().height * 0.5;
            //
            // this.rightButton.x = 0.8 * clientRect.width;
            // this.rightButton.y = 0.5 * clientRect.height - this.rightButton.getBounds().height * 0.5;

            var ballImg = this.loader.getResult('ball');
            this.ball = new createjs.Bitmap(ballImg);
            // 随机出现
            // ball.x = Math.random() * 0.5 * clientRect.width + 0.3 * clientRect.width;
            // ball.y = Math.random() * 0.5 * clientRect.height + 0.3 * clientRect.height;
            // this.ball.x = 200;
            // this.ball.y = 150;
            // this.ball.isMoving = false;
            // this.ball.vx = 0;
            // this.ball.vy = 0;
            this.ball.scaleX = canvas.width / bg1.getBounds().width;
            this.ball.scaleY = canvas.height / bg1.getBounds().height;
            this.ball.width = this.ball.getBounds().width;
            this.ball.height = this.ball.getBounds().height;
            this.initScore();
            this.initStart();


            this.lastLeftButtonStyle = this.leftButton.getTransformedBounds();
            this.lastRightButtonStyle = this.rightButton.getTransformedBounds();

            //this.stage.addChild(Rect);//添加子视图
            this.initEvent();

            buttonContainer.addChild(this.ball);
            buttonContainer.addChild(this.rightButton);
            buttonContainer.addChild(this.leftButton);

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
        },
        checkIsGetScore: function () {
            var height = clientRect.height;
            var width = clientRect.width;
            var TopLimit = height * 0.3567;
            var BottomLimit = height * 0.63;
            var leftLimit = width * 0.048;
            var rightLimit = width * 0.92;
            if (this.ball.x <= leftLimit) {
                if (this.ball.y >= TopLimit && this.ball.y <= BottomLimit) {
                    // 左边被进球
                    return 1;
                }
            }

            if (this.ball.x >= rightLimit) {
                if (this.ball.y >= TopLimit && this.ball.y <= BottomLimit) {
                    return 2;
                }
            }
            return 0;
        }
    };


    window.gameManager = gameManager;
})(window, createjs);