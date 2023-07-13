class ThoughtDraught extends PlayerAI {
    constructor(name){
        super(name);
        this.name = '#ff0000#9D702E';
    }

    makeMove( gamestate, moves ){

        if( gamestate.isGameOver() ) { return [] };
        let publicDepth = 4

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

                    if (depth === publicDepth) {
                        this.child.push(child)
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
                    score = (this.gamestate.getscore(1) - this.gamestate.getscore(2)).toString()
                }
                else {
                    score = (this.gamestate.getscore(2) - this.gamestate.getscore(1)).toString()
                }
                let positionValue = 0

                let piecesLeft = 0
                for (let i of this.gamestate.getPlayableLocations()) {
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

        let root = new AlphaBetaNode(gamestate.deepCopy(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        let max = root.alphaBeta(root, publicDepth)
        let pick = null
        for (i in root.child) {
            if (i.beta = max) {
                pick = root.child.indexOf(i)
                break
            }
        }

        let validMoves = node.gamestate.getValidMoves();

        for( let move of validMoves[pick] ) {
            moves.push( move )
        }
        
        return validMoves[pick];
    }
}
