class Torpedo extends PlayerAI{
    constructor( name ){
        super(name);
        this.name = "Torpedo";
    }

    static depth = 8;
    static lastChildren = []

    makeMove( gameState, move ){
        let myTurn = gameState.whoseTurn();

        class MMNode {
            constructor(gameState, alpha, beta, isMax){
                this.gs = gameState;
                this.alpha = alpha;
                this.beta = beta;
                this.isMax = isMax;
                this.children = []
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

            alphabetasearch( depth ){

                if (depth === 0) {
                    return this.heuristic();
                }
                let node = this
                for (let child of node.children) {
                    if (node.alpha >= node.beta) {
                        break
                    }
                    let rtn = this.alphaBeta(child, depth - 1)
                    if (node.isMax && rtn > node.alpha) {
                        node.alpha = rtn
                    }
                    else if (!node.isMax && rtn < node.beta) {
                        node.beta = rtn
                    }
                }

                if (node.isMax) {
                    return node.alpha
                }
                else {
                    return node.beta
                }

            }

            findLeaves() {
                let list = []

                let helper = function (node) {
                    if (node.children == []) {
                        list.push(node)
                        return
                    }
                    for (let child of node.children) {
                        helper(child)
                    }
                    return
                }

                helper(this)
                return list
            }

           

            score(){
                let score = this.gs.getScore(myTurn);
                score += ((this.gs.getValidMoves().length)* 1.5);
                

                return score;
            }
        }

        if (Torpedo.lastChildren.length == 0) {
            // Set up for the root
            let alpha = Number.NEGATIVE_INFINITY;
            let beta = Number.POSITIVE_INFINITY;

            let vms = gameState.getValidMoves();
            for( let vm of vms ){

                // copy the gamestate and make a move
                let newGS = gameState.deepCopy();
                newGS.makeMove( vm );

                // Make an MMNode appropriately and run alphabeta on it
                let child = new MMNode(newGS, alpha, beta, true);
                let rtn = child.alphabeta(Torpedo.depth);

                if( rtn > alpha ){
                    alpha = rtn;

                    // clear the array
                    move.length = 0;

                    // Copy the valid move into move
                    for( let m of vm ){
                        move.push(m);
                    }
                }

                Torpedo.lastChildren.push(child)
            }

        }
        else {
            let root = null
            console.log(Torpedo.lastChildren)
            for (let child of Torpedo.lastChildren) {
                console.log(child)
                if (this.compareStates(child.gs, gameState)) {
                    // Now to activate my special move
                    root = child
                    break;
                }
            }``
            //console.log("done redoing tree")
            // Root is now the child, which is the current game state.
            // Now it's time to run a transversal of the tree and run alphabeta on all of the leaves
            let leaves = root.findLeaves()
            for (let leaf of leaves) {
                leaf.alphaBeta(leaf, 1)
            }


            let alpha = Number.NEGATIVE_INFINITY;
            let beta = Number.POSITIVE_INFINITY;
            let vms = gameState.getValidMoves();
            for( let vm of vms ){

                // Make an MMNode appropriately and run alphabeta on it
                let rtn = root.alphabetasearch(Torpedo.depth);

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
            Torpedo.lastChildren = []
            for (let child of root.children) {
                Torpedo.lastChildren.push(child)
            }
        }
    }
    compareStates(state1, state2) {
        if (state1.getValidMoves() == state2.getValidMoves()) {
            console.log("moves different")
            return false;
        }
        return true;
    }
}
