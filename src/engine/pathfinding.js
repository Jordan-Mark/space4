class Path {

    constructor(orderedNodeList){
        this.orderedNodeList = orderedNodeList;
    }


    next (i){
        return this.orderedNodeList[i+1] ? i+1 <= this.orderedNodeList.length : null
    }

}