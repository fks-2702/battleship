class ThoughtDraught extends PlayerAI {
    constructor(name){
        super(name);
        this.name = '#ff0000#9D702E';
    }

    makeMove( gameState, moves ){

        let myTurn = gameState.whoseTurn();
        console.log(myTurn)
        class MMN {
            constructor(gameState, alpha, beta, isMax){
                this.gs = gameState;
                this.alpha = alpha;
                this.beta = beta;
                this.isMax = isMax;
            }

            alphabeta( depth ){
                if( depth === 0 ){
                    return this.heuristic();
                }

                let validMoves = this.gs.getValidMoves();
                for( let vm of validMoves ){
                    if( this.alpha >= this.beta ){ break; }
                    
                    // Make a copy of the gamestate and make a move on it
                    let newGameState = this.gs.deepCopy();
                    newGameState.makeMove(vm);

                    // Create a child MMNode appropriately
                    let child = new MMN(newGameState, this.alpha, this.beta, !this.isMax);

                    // run alphabeta with depth-1
                    let rtn = child.alphabeta(depth - 1);

                    // use the return to change alpha or beta correctly
                    if( this.isMax ){
                        if( rtn > this.alpha ){
                            this.alpha = rtn;
                        }
                    }
                    else {
                        if( rtn < this.beta ){
                            this.beta = rtn;
                        }
                    }
                }

                // Return the correct value based on me being a minimizer of maximizer
                if( this.isMax ){
                    return this.alpha;
                }
                else {
                    return this.beta;
                }

            }

            heuristic () {
                let score = 0
                console.log(this.gs.getScore(1))
                if (myTurn == 1) {
                    score = (this.gs.getScore(1) - this.gs.getScore(2)).toString()
                }
                else {
                    score = (this.gs.getScore(2) - this.gs.getScore(1)).toString()
                }
                let positionValue = 0

                let piecesLeft = 0
                let playableLocations = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"]
                for (let i of playableLocations) {
                    if (this.gs.getOwner(i)) {
                        piecesLeft++
                    }

                    //console.log(this.gs.whoseTurn(), this.gs.getOwner(i), this.gs.getLevel(i))
                    if (publicDepth % 2 == 1) {
                        if (myTurn == 1 && this.gs.getOwner(i) == 1 && this.gs.getLevel(i) < 2) {
                            positionValue = positionValue + Math.floor(parseInt(i, 10) / 12)
                        }
                        else if (myTurn == 2 && this.gs.getOwner(i) == 2 && this.gs.getLevel(i) < 2) {
                            positionValue = positionValue + Math.floor(Math.abs(parseInt(i, 10)-33) / 12)
                        }
                    }
                    else {
                        if (myTurn == 1 && this.gs.getOwner(i) == 2 && this.gs.getLevel(i) < 2) {
                            positionValue = positionValue + Math.floor(parseInt(i, 10) / 12)
                        }
                        else if (myTurn == 2 && this.gs.getOwner(i) == 1 && this.gs.getLevel(i) < 2) {
                            positionValue = positionValue + Math.floor(Math.abs(parseInt(i, 10)-33) / 12)
                        }
                    }
                }
                //console.log("peaces:",piecesLeft)
                //console.log("posVal:",positionValue)
                score = score + (8 * positionValue).toString()
                score = score + (64 - (2 * piecesLeft)).toString()
                score = score + (Math.floor(Math.random() * 2)).toString()
                
                //console.log(score)
                score = parseInt(score, 10)
                //console.log(score)
            }
        }

        let alpha = Number.NEGATIVE_INFINITY
        let beta = Number.POSITIVE_INFINITY
        let publicDepth = 4

        let validMoves = gameState.getValidMoves();

        //console.log(gameState.getValidMoves())
        //console.log(validMoves)

        for( let vm of validMoves) {
            //console.log("possible:",vm)
            let newState = gameState.deepCopy()
            newState.makeMove(vm)

            if (newState.isGameOver()) {
                for (let m of vm) {
                    moves.push(m)
                }
                //console.log("foundwin")
                break
            }

            let child = new MMN(newState, alpha, beta, true);
            //console.log(alpha, beta)
            let rtn = child.alphabeta(publicDepth)

            if (rtn > alpha) {
                alpha = rtn
                moves.length = 0

                //console.log("moves:",vm)
                for (let m of vm) {
                    moves.push(m)
                }
            }
        }

        //console.log("validmoves:",gameState.getValidMoves())
        //console.log("finalmoves:",moves)

        return moves;
    }
}
