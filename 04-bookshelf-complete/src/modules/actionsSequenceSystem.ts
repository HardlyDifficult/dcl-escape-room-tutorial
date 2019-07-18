export class ActionsSequenceSystem{
    private beginSequenceNode : SequenceNode = null
    private currentSequenceNode : SequenceNode = null

    private running: boolean = false
    private started: boolean = false

    private onFinishCallback: ()=>void

    startSequence(sequenceBuilt: ActionsSequenceSystem.SequenceBuilder){
        this.beginSequenceNode = sequenceBuilt.beginSequenceNode
        this.currentSequenceNode = this.beginSequenceNode
        this.running = true
        this.started = false
    }

    setOnFinishCallback(onFinishCallback: ()=>void){
        this.onFinishCallback = onFinishCallback
    }

    isRunning(): boolean{
        return this.running
    }

    stop(){
        this.running = false
    }

    resume(){
        if (this.beginSequenceNode != null){
            this.running = true
        }
    }

    reset(){
        this.currentSequenceNode = this.beginSequenceNode
        this.running = true
        this.started = false
    }

    getRunningAction(): ActionsSequenceSystem.IAction{
        let currentNode: SequenceNode = this.currentSequenceNode

        if (this.currentSequenceNode instanceof SubSequenceNode){
            do{
                currentNode = (currentNode as SubSequenceNode).currentInnerSequence
            }while(currentNode instanceof SubSequenceNode)
        }
        return currentNode.action
    }

    update(dt: number): void{
        if (this.running){
            if (!this.started){
                this.currentSequenceNode.onStart()
                this.started = true
            }
            else{
                if (!this.currentSequenceNode.hasFinish()){
                    this.currentSequenceNode.update(dt)
                }
                else{
                    this.currentSequenceNode.onFinish()
                    this.currentSequenceNode = this.currentSequenceNode.next
                    if (this.currentSequenceNode){
                        this.currentSequenceNode.onStart()   
                    }
                    else{
                        this.running = false
                        if (this.onFinishCallback)this.onFinishCallback()
                    }              
                }
            }
        }
    }
}

export namespace ActionsSequenceSystem {

    export interface IAction{
        onStart(): void,
        update(dt: number): void,
        onFinish(): void,
        hasFinished : boolean
    }

    export class SequenceBuilder{
        private currentSequenceNode : SequenceNode = null
        public beginSequenceNode : SequenceNode = null

        private whileNodeStack : WhileSequenceNode[] = []

    
        then(action: ActionsSequenceSystem.IAction): SequenceBuilder{
            if (this.currentSequenceNode == null){
                this.currentSequenceNode = new SequenceNode()
                this.currentSequenceNode.action = action
                this.beginSequenceNode = this.currentSequenceNode
            }
            else{
                let next = new SequenceNode()
                next.action = action
                this.currentSequenceNode = this.currentSequenceNode.then(next)
            }
            return this
        }
    
        if (condition: ()=>boolean): SequenceBuilder{
            let ifSeq = new IfSequenceNode(condition)
            if (this.currentSequenceNode == null){
                this.currentSequenceNode = ifSeq
                this.beginSequenceNode = ifSeq
            }
            else{
                this.currentSequenceNode = this.currentSequenceNode.then(ifSeq)
            }
            return this
        }
    
        else (): SequenceBuilder{
            let seq = this.currentSequenceNode.getSequence()
            if (seq instanceof IfSequenceNode){
                seq.closed = true
                let elseSeq = new ElseSequenceNode(seq)
                this.currentSequenceNode = this.currentSequenceNode.then(elseSeq)
            }
            else{
                throw new Error("IF statement is needed to be called before ELSE statement.");
            }
            return this
        }
    
        endIf (): SequenceBuilder{
            let seq = this.currentSequenceNode.getSequence()
            if (seq instanceof IfSequenceNode || seq instanceof ElseSequenceNode){
                seq.closed = true
            }
            else{
                throw new Error("IF statement is needed to be called before ENDIF statement.");
            }
            return this
        }
    
        while (condition: ()=>boolean): SequenceBuilder{
            let whileSeq = new WhileSequenceNode(condition)
            if (this.currentSequenceNode == null){
                this.currentSequenceNode = whileSeq
                this.beginSequenceNode = whileSeq
            }
            else{
                this.currentSequenceNode = this.currentSequenceNode.then(whileSeq)
            }
            this.whileNodeStack.push(whileSeq)
            return this
        }
    
        endWhile (): SequenceBuilder{
            let seq = this.currentSequenceNode.getSequence()
            if (seq instanceof WhileSequenceNode){
                seq.closed = true
                if (this.whileNodeStack.length > 0){
                    this.whileNodeStack.splice(this.whileNodeStack.length-1,1)
                }
            }
            else{
                throw new Error("WHILE statement is needed to be called before ENDWHILE statement.");
            }
            return this
        }

        breakWhile() : SequenceBuilder{
            if (this.whileNodeStack.length > 0){
                this.currentSequenceNode = this.currentSequenceNode.then(new BreakWhileSequenceNode(this.whileNodeStack[this.whileNodeStack.length-1]))
            }
            else{
                throw new Error("WHILE statement is needed to be called before BREAKWHILE statement.");
            }
            return this
        }
    }
}


class SequenceNode {
    action: ActionsSequenceSystem.IAction = null
    next: SequenceNode = null

    then(next: SequenceNode) : SequenceNode{
        this.next = next
        return next
    }

    onStart(){
        if (this.action)this.action.onStart()
    }

    update(dt: number){
        if (this.action)this.action.update(dt)
    }

    onFinish(){
        if (this.action)this.action.onFinish()
    }

    hasFinish() : boolean{
        if (this.action) return this.action.hasFinished
        else return true
    }

    getSequence(): SequenceNode{
        return this
    }
}

class SubSequenceNode extends SequenceNode {
    currentInnerSequence: SequenceNode = null
    startingInnerSequence: SequenceNode = null
    closed: boolean = false

    then(next: SequenceNode) : SequenceNode{
        if (this.currentInnerSequence == null){
            this.currentInnerSequence = next
            this.startingInnerSequence = next
        }
        else{
            if (this.closed){
                this.next = next
                return next
            }
            else{
                this.currentInnerSequence = this.currentInnerSequence.then(next)
            }
        }
        return this
    }

    onStart(){
        this.currentInnerSequence = this.startingInnerSequence
        if (this.currentInnerSequence) this.currentInnerSequence.onStart()
    }

    update(dt: number){
        if (this.currentInnerSequence){
            if (!this.currentInnerSequence.hasFinish()){
                this.currentInnerSequence.update(dt)
            }
            else{
                this.currentInnerSequence.onFinish()
                this.currentInnerSequence = this.currentInnerSequence.next
                if (this.currentInnerSequence) this.currentInnerSequence.onStart()                
            }
        }
    }

    onFinish(){
        if (this.currentInnerSequence) this.currentInnerSequence.onFinish()
    }

    hasFinish(): boolean{
        return this.currentInnerSequence == null
    }

    getSequence(): SequenceNode{
        if (this.currentInnerSequence){
            let innerSeq = this.currentInnerSequence.getSequence()
            if (innerSeq instanceof SubSequenceNode){
                if (!innerSeq.closed){
                    return innerSeq
                }
            }
        }
        return this
    }
}

class IfSequenceNode extends SubSequenceNode {
    condition: ()=> boolean
    result: boolean

    constructor(condition: ()=> boolean){
        super()
        this.condition = condition
    }

    onStart(){
        this.result = this.condition()
        if (this.result) super.onStart()
        else this.currentInnerSequence = null
    }
}

class ElseSequenceNode extends SubSequenceNode {
    ifSequence: IfSequenceNode = null

    constructor(ifSequence: IfSequenceNode){
        super()
        this.ifSequence = ifSequence
    }

    onStart(){
        if (!this.ifSequence.result) super.onStart()
        else this.currentInnerSequence = null
    }
}

class WhileSequenceNode extends SubSequenceNode {
    condition: ()=> boolean
    breakWhile: boolean = false

    constructor(condition: ()=> boolean){
        super()
        this.condition = condition
    }

    onStart(){
        this.breakWhile = false
        if (this.condition()) super.onStart()
        else this.currentInnerSequence = null
    }

    update(dt: number){
        if (this.currentInnerSequence){
            if (!this.currentInnerSequence.hasFinish()){
                this.currentInnerSequence.update(dt)
            }
            else{
                this.currentInnerSequence.onFinish()
                this.currentInnerSequence = this.currentInnerSequence.next
                if (this.currentInnerSequence == null) this.currentInnerSequence = this.startingInnerSequence
                this.currentInnerSequence.onStart()
            }
        }
    }

    hasFinish(): boolean{
        return this.breakWhile || !this.condition()
    }
}

class BreakWhileSequenceNode extends SequenceNode{
    whileNode: WhileSequenceNode

    constructor(whileNode: WhileSequenceNode){
        super()
        this.whileNode = whileNode
    }

    onStart(){
        this.whileNode.breakWhile = true
    }
}