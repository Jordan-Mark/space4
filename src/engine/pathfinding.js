class Path {

    constructor(orderedNodeList){
        this.orderedNodeList = orderedNodeList;
        this.length = this.orderedNodeList.length;
    }


    next (i){
        return this.orderedNodeList[i+1] ? i+1 <= this.orderedNodeList.length : null
    }

}