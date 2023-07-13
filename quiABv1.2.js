class ThoughtDraught extends PlayerAI {
    constructor(name){
        super(name);
        this.name = '#ff0000#9D702E';
    }

    makeMove( gamestate, moves ){

        if( gamestate.isGameOver() ) { return [] };

        class AlphaBetaNode {
            constructor (gamestate, alpha, beta, isMax) {
                this.gamestate = gamestate
                this.alpha = alpha
                this.beta = beta
                this.isMax = isMax
                this.child = []
            }

            quiAB (node, depth, alpha, beta) {
                let lastMax = alpha
                let lastMin = beta
                let currentSigs = this.heuristic()

                if (depth === 0) {
                    return this.heuristic()
                }
                else if (node.isMax && currentSigs * 4 / 3 > lastMax) {
                    return this.heuristic()
                }
                else if (node.isMin && currentSigs * 3 / 4 > lastMin) {
                    return this.heuristic()
                }

                let validMoves = node.gamestate.getValidMoves()

                for (let i of validMoves) {
                    let newGamestate = gamestate.deepCopy();
                    newGamestate.makeMove(i);
                    
                    let child = new AlphaBetaNode(newGamestate, node.alpha, node.beta, !node.isMax);

                    if (node.isMax) {
                        lastMax = this.heuristic()
                        this.quiAB(child, depth - 1, lastMax, beta) 
                    }
                    else {
                        lastMin= this.heuristic()
                        this.quiAB(child, depth - 1, alpha, lastMin)
                    }
                }
            }

            alphaBeta (node, depth) {
                if (depth === 0) {
                    //if ((node.isMax && this.heuristic * 4 / 3 > lastMax) || (node.isMin && this.heuristic * 3 / 4 > lastMin)) {
                    return this.heuristic();
                    //}
                    //else {
                    //    return this.quiAB(node, publicDepth, this.alpha, this.beta)
                    //}
                }

                let validMoves = this.gamestate.getValidMoves();

                //ab pruning
                for (let i of validMoves) {
                    if (this.alpha >= this.beta) {
                        break
                    }

                    let newGamestate = this.gamestate.deepCopy();
                    newGamestate.makeMove(i);
                    
                    let child = new AlphaBetaNode(newGamestate, this.alpha, this.beta, !this.isMax);
                    let rtn = child.alphaBeta(child, depth - 1);

                    if (this.isMax && rtn > this.alpha) {
                        this.alpha = rtn
                    }
                    else if (!this.isMax && rtn < this.beta) {
                        this.beta = rtn
                    }
                }

                if (this.isMax) {
                    return this.alpha
                }
                else {
                    return this.beta
                }
            }

            heuristic () {
                let score = 0
                if (this.gamestate.whoseTurn() == 1) {
                    score = (this.gamestate.getScore(1) - this.gamestate.getScore(2)).toString()
                }
                else {
                    score = (this.gamestate.getScore(2) - this.gamestate.getScore(1)).toString()
                }
                let positionValue = 0

                let piecesLeft = 0
                let playableLocations = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"]
                for (let i of playableLocations) {
                    if (this.gamestate.getOwner(i) != null) {
                        piecesLeft++
                    }
                    if (this.gamestate.whoseTurn() == 1 && this.gamestate.getOwner(i) == 1 && this.gamestate.getLevel(i) == 0) {
                        positionValue = positionValue + Math.floor(i/2)
                    }
                    else if (this.gamestate.whoseTurn() == 2 && this.gamestate.getOwner(i) == 2 && this.gamestate.getLevel(i) == 0) {
                        positionValue = positionValue + Math.floor(Math.abs(i-33)/2)
                    }
                }

                score = score + (6 * positionValue).toString()
                score = score + ((100) - 3 * piecesLeft).toString()
                score = score + (this.gamestate.getValidMoves().length).toString()
                score = score + (Math.floor(Math.random() * 2)).toString()

                score = parseInt(score, 10)
            }
        }

        let alpha = Number.NEGATIVE_INFINITY
        let beta = Number.POSITIVE_INFINITY
        let publicDepth = 4

        let validMoves = gamestate.getValidMoves();

        for( let vm of validMoves) {
            let newState = gamestate.deepCopy
            newState.makeMove(vm)

            let child = new AlphaBetaNode(newState, alpha, beta, true);
            let rtn = child.alphaBeta(publicDepth)

            if (rtn > alpha) {
                alpha = rtn
                moves.length = 0

                for (let m of vm) {
                    moves.push(m)
                }
            }
        }
    }
}