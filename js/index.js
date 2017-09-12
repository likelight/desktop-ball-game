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

    // 生成左侧撞击球速度
    function makeleftBallStatus(px, py, ballVx, ballVy) {
        vx = -px * 4;
        vy = -py * 4;
        var afterBallVx = 0;
        var afterBallVy = 0;

        if (vx === 0) {
            afterBallVx = -ballVx * 80;
        } else {
            if (vx > 0  && ballVx > 0) {
                afterBallVx = ballVx * 80 + vx * 2.5;
            } else {
                afterBallVx = -ballVx * 80 + vx * 2.5;
            }
        }

        if (vy === 0) {
            afterBallVy = -ballVy * 80;
        } else {
            afterBallVy = ballVy * 80 + vy * 2.5;
        }

        return {
            vx: afterBallVx, vy: afterBallVy
        };
    }

    // 生成右侧撞击球速度
    function makeRightBallStatus(px, py, ballVx, ballVy) {
        vx = -px * 4;
        vy = -py * 4;
        var afterBallVx = 0;
        var afterBallVy = 0;

        if (vx === 0) {
            afterBallVx = -ballVx * 80;
        } else {
            if (vx < 0  && ballVx < 0) {
                afterBallVx = ballVx * 80 + vx * 2.5;
            } else {
                afterBallVx = -ballVx * 80 + vx * 2.5;
            }
        }

        if (vy === 0) {
            afterBallVy = -ballVy * 80;
        } else {
            afterBallVy = ballVy * 80 + vy * 2.5;
        }

        return {
            vx: afterBallVx, vy: afterBallVy
        };
    }

    var canvas = document.getElementById('match');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;

    var clientRect = canvas.getBoundingClientRect();
    var directionX = 1;
    var directionY = 1;
    var kn = 1.2;
    var fps = 80;
    var gameManager = {
        count: 0,
        leftCount: 0,
        rightCount: 0,
        collisionFlag: false,
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
            this.leftButtonPosition = [];
            this.rightButtonPosition = [];
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
                    this.rightScore++;
                    if (this.rightScore <= 99) {
                        setRightScore(this.rightScore);
                    } else {
                        this.rightScore = 0;
                        setRightScore(this.rightScore);
                    }
                } else if (result === 2) {
                    // 右边被进球,左边得分
                    this.leftScore++;
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
            var maxLength = 20;

            if (this.leftButtonPosition.length < maxLength) {
                this.leftButtonPosition.push({x: this.leftButton.x, y: this.leftButton.y});
            } else {
                this.leftButtonPosition.shift();
                this.leftButtonPosition.push({x: this.leftButton.x, y: this.leftButton.y});
            }

            if (this.rightButtonPosition.length < maxLength) {
                this.rightButtonPosition.push({x: this.rightButton.x, y: this.rightButton.y});
            } else {
                this.rightButtonPosition.shift();
                this.rightButtonPosition.push({x: this.rightButton.x, y: this.rightButton.y});
            }


            // 判断是否与button相撞
            var leftIntersection = ndgmr.checkPixelCollision(this.ball, this.leftButton, 0);
            var rightIntersection = ndgmr.checkPixelCollision(this.ball, this.rightButton, 0);

            if (leftIntersection && this.collisionFlag !== 'left') {
                var xDistance = this.leftButtonPosition[0].x - this.leftButtonPosition[this.leftButtonPosition.length - 1].x;
                var yDistance = this.leftButtonPosition[0].y - this.leftButtonPosition[this.leftButtonPosition.length - 1].y;
                var vBall = makeleftBallStatus(xDistance, yDistance, this.ball.vx, this.ball.vy);
                this.collisionFlag = 'left';
                this.ball.vx = vBall.vx / 80;
                this.ball.vy = vBall.vy / 80;
                this.ball.isMoving = true;
                this.count = 0;
                directionY = directionX = 1;

            }

            if (rightIntersection && this.collisionFlag !== 'right') {
                var xDistance1 = this.rightButtonPosition[0].x - this.rightButtonPosition[this.rightButtonPosition.length - 1].x;
                var yDistance1 = this.rightButtonPosition[0].y - this.rightButtonPosition[this.rightButtonPosition.length - 1].y;
                var vBall = makeRightBallStatus(xDistance1, yDistance1, this.ball.vx, this.ball.vy);
                this.collisionFlag = 'right';
                this.ball.vx = vBall.vx / 80;
                this.ball.vy = vBall.vy / 80;
                this.ball.isMoving = true;
                this.count = 0;
                directionY = directionX = 1;
            }

            if (this.collisionFlag === 'left' || this.collisionFlag === 'right') {
                this.count++;
                if (this.count >= 15) {
                    this.collisionFlag = false;
                    this.count = 0;
                }

            }


            this.ball.vCom = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
            // 设定最大最小值
            if (this.ball.vCom >= 90) {
                this.ball.vCom = 90;
            }
            this.ball.vCom -= kn / fps;
            if (Math.abs(this.ball.vCom) <= kn / fps) {
                this.ball.vCom = 0;
                this.ball.isMoving = false;
                this.ball.vx = 0;
                this.ball.vy = 0;
                this.stage.update();
                return;

            }
            var vx = this.ball.vCom * this.ball.vx / Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
            var vy = this.ball.vCom * this.ball.vy / Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);

            this.ball.vx = vx;
            this.ball.vy = vy;

            // 球继续运动
            if (this.ball.isMoving) {
                this.ball.x += this.ball.vx * 1 / 2;
                this.ball.y += this.ball.vy * 1 / 2;

                if (this.ball.x < 20) {
                    if (Math.abs(directionX * 0.8) > 10) {
                        directionX = -directionX * 0.8;
                    }
                    else {
                        this.ball.vx = -this.ball.vx;
                        // directionX = -directionX;
                    }
                }
                if (this.ball.x > clientRect.width - this.ball.width - 15) {
                    if (Math.abs(directionX * 0.8) > 10) {
                        directionX = -directionX * 0.8;
                    }
                    else {
                        // directionX = -directionX;
                        this.ball.vx = -this.ball.vx;

                    }
                }
                if (this.ball.y > clientRect.height - this.ball.height - 12) {
                    if (Math.abs(directionY * 0.8) > 10) {
                        directionY = -directionY * 0.8;
                    }
                    else {
                       // directionY = -directionY;
                        this.ball.vy = -this.ball.vy;
                    }
                }
                if (this.ball.y < 12) {
                    if (Math.abs(directionY * 0.8) > 10) {
                        directionY = -directionY * 0.8;
                    }
                    else {
                        // directionY = -directionY;
                        this.ball.vy = -this.ball.vy;

                    }
                }

                this.stage.update();
            }

        },
        initStart: function () {
            this.leftButton.x = 0.1 * clientRect.width;
            this.leftButton.y = 0.5 * clientRect.height - this.leftButton.getTransformedBounds().height * 0.5;
            this.rightButton.x = 0.8 * clientRect.width;
            this.rightButton.y = 0.5 * clientRect.height - this.rightButton.getTransformedBounds().height * 0.5;
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
        initButton: function (canvas, bg1) {
            this.buttonContainer = new createjs.Container();

            var buttonImg = this.loader.getResult('button');
            this.leftButton = new createjs.Bitmap(buttonImg);
            this.rightButton = new createjs.Bitmap(buttonImg);

            this.rightButton.scaleX = this.leftButton.scaleX = canvas.width / bg1.getBounds().width;
            this.rightButton.scaleY = this.leftButton.scaleY = canvas.height / bg1.getBounds().height;

            var ballImg = this.loader.getResult('ball');
            this.ball = new createjs.Bitmap(ballImg);
            this.ball.scaleX = canvas.width / bg1.getBounds().width;
            this.ball.scaleY = canvas.height / bg1.getBounds().height;
            this.ball.width = this.ball.getTransformedBounds().width;
            this.ball.height = this.ball.getTransformedBounds().height;
            this.lastLeftButtonStyle = this.leftButton.getTransformedBounds();
            this.lastRightButtonStyle = this.rightButton.getTransformedBounds();

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

                shape.on("pressup", function (evt) {
                    // this.lastLeftButtonStyle = shape.getTransformedBounds();
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

                shape.on("pressup", function (evt) {
                    // shape.removeAllEventListeners();
                }.bind(this));

            }.bind(this));
        },
        initStage: function () {
            this.stage = new createjs.Stage(canvas);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.setFPS(fps);
            createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            createjs.Ticker.addEventListener("tick", this.tick.bind(this));
        },
        handleLoadComplete: function () {
            this.initStage();

            var bgContainer = new createjs.Container();
            var bgResult = this.loader.getResult('court');
            var bg1 = new createjs.Bitmap(bgResult);
            bg1.x = bg1.y = 0;
            var scaleX = (canvas.width / bg1.getBounds().width)  / 1.5;
            var scaleY = (canvas.height / (bg1.getBounds().height)) / 1.5;

            bg1.scaleX = scaleX * 1.5;
            bg1.scaleY = scaleY * 1.5;
            bgContainer.addChild(bg1);

            var buttonContainer = new createjs.Container();
            var buttonImg = this.loader.getResult('button');
            this.leftButton = new createjs.Bitmap(buttonImg);
            this.rightButton = new createjs.Bitmap(buttonImg);
            this.rightButton.scaleX = this.leftButton.scaleX = scaleX;
            this.rightButton.scaleY = this.leftButton.scaleY = scaleY;

            // 添加球
            var ballImg = this.loader.getResult('ball');
            this.ball = new createjs.Bitmap(ballImg);

            this.ball.scaleX = scaleX;
            this.ball.scaleY = scaleY;
            this.ball.width = this.ball.getTransformedBounds().width;
            this.ball.height = this.ball.getTransformedBounds().height;
            this.initScore();
            this.initStart();

            this.lastLeftButtonStyle = this.leftButton.getTransformedBounds();
            this.lastRightButtonStyle = this.rightButton.getTransformedBounds();

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
            var TopLimit = height * 0.32;
            var BottomLimit = height * 0.64 - this.ball.height / 2;
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