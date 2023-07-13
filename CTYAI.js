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
                        node.child.push(child)
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
                let score = this.gamestate.getscore(this.name).toString()

                let piecesLeft = 0
                for (let i of this.gamestate.getPlayableLocations()) {
                    if (this.gamestate.getOwner(i) != null) {
                        piecesLeft++
                    }
                }
                score = score + (2 * piecesLeft).toString()
                score = score + (2 * this.gamestate.getValidMoves().length).toString()
                score = score + (Math.floor(Math.random() * 2)).toString()
                score = parseInt(score, 10)
            }
        }

        let root = new AlphaBetaNode(gamestate.deepCopy(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, True);
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