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
                this.children = []
            }


            alphaBeta (node, depth) {
                if (depth === 0) {
                    return this.heuristic();
                }

                let validMoves = node.gamestate.getValidMoves();

                for (let i of validMoves) {
                    if (node.alpha >= node.beta) {
                        break
                    }

                    let newGamestate = gamestate.deepCopy();
                    newGamestate.makeMove(i);
                    
                    let child = new AlphaBetaNode(newGamestate, node.alpha, node.beta, !node.isMax);
                    let rtn = alphaBeta(child, depth - 1);

                    if (node.isMax && rtn > node.alpha) {
                        node.alpha = rtn
                    }
                    else if (!node.isMax && rtn < node.beta) {
                        node.beta = rtn
                    }

                    if (depth === publicDepth) {
                        node.children.push(child)
                    }
                }

                if (node.isMax) {
                    return node.alpha
                }
                else {
                    return node.beta
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

                score = score + (2 * positionValue).toString()
                score = score + (2 * piecesLeft).toString()
                score = score + (2 * this.gamestate.getValidMoves().length).toString()
                score = score + (Math.floor(Math.random() * 2)).toString()

                score = parseInt(score, 10)
            }
        }

        let root = new AlphaBetaNode(gamestate.deepCopy(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        let max = root.alphaBeta(root, publicDepth)
        let pick = null
        for (i in root.children) {
            if (i.beta = max) {
                pick = root.children.indexOf(i)
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
