

class HTMLManager {

    constructor (htmlElement){
        this.htmlElement = htmlElement;
    }
}

class ParagraphManager extends HTMLManager {

    constructor(htmlElement){
        super(htmlElement);
        this.featured = null; // world id
    }

    getFeatured(){
        return this.featured;
    }

    feature(id){
        this.featured = id;
    }

    display(html){
        this.htmlElement.innerHTML = html;
    }

}