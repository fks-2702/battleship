@@ -1,101 +1,208 @@
class fAIrris extends PlayerAI{
    constructor( name ){
        super(name);
        this.name = "torpedo";
    }

    makeMove( gameState, move ){
        let myTurn = gameState.whoseTurn();

        class MMNode {
            constructor(gameState, alpha, beta, isMax){
                this.gs = gameState;
                this.alpha = alpha;
                this.beta = beta;
                this.isMax = isMax;
            }

            alphabeta( depth ){
                if( depth === 0 ){
                    return this.score();
                }

                let validMoves = this.gs.getValidMoves();
                for( let vm of validMoves ){
                    if( this.alpha >= this.beta ){ break; }

                    // Make a copy of the gamestate and make a move on it
                    let newGameState = this.gs.deepCopy();
                    newGameState.makeMove(vm);

                    // Create a child MMNode appropriately
                    let child = new MMNode(newGameState, this.alpha, this.beta, !this.isMax);

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

            score(){
                let score = this.gs.getScore(myTurn);
                score += ((this.gs.getValidMoves().length)* 1.5);


                return score;
            }
        }

        // Set up for the root
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        let maxDepth = 2;

        let vms = gameState.getValidMoves();
        for( let vm of vms ){

            // copy the gamestate and make a move
            let newGS = gameState.deepCopy();
            newGS.makeMove( vm );

            // Make an MMNode appropriately and run alphabeta on it
            let child = new MMNode(newGS, alpha, beta, true);
            let rtn = child.alphabeta(maxDepth);


            if( rtn > alpha ){
                alpha = rtn;

                // clear the array
                move.length = 0;

                // Copy the valid move into move
                for( let m of vm ){
                    move.push(m);
                }
            }

        }
    }

}