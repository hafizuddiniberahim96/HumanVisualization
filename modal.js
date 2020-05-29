class PersonNode{
    constructor(name,noIc,noPhone){
      this.name = name;
      this.noIc=noIc;
      this.noPhone=noPhone;
      this.neighbours=[];
      this.parents=[];
      this.siblings=[];
    }

    addparents(parent){
      this.parents.push(parent);
    }
    addsiblings(sibling){
      this.siblings.push(sibling);
    }
    addneighbours(neighbour){
      this.neighbours.push(neighbour);
    }

}

class Graph{
  constructor() {
   this.peopleNodes = [];
   this.parentNodes = [];
   this.neighbourNodes = [];
   this.siblingNodes = [];
   this.edges = [];
 }
 addPersonNode(name,noIc,noPhone) {
    this.peopleNodes.push(new PersonNode(name,noIc,noPhone));
  }
  addparentNode(name,noIc,noPhone) {
     this.parentNodes.push(new PersonNode(name,noIc,noPhone));
   }
   addneighbourNode(name,noIc,noPhone) {
      this.neighbourNodes.push(new PersonNode(name,noIc,noPhone));
    }
    addsiblingNode(name,noIc,noPhone) {
       this.siblingNodes.push(new PersonNode(name,noIc,noPhone));
    }
    getPerson(name) {
    return this.peopleNodes.find(person => person.name === name);
  }
  getParent(name){
    return this.parentNodes.find(person => person.name === name);
  }
  getSibling(name){
    return this.siblingNodes.find(person => person.name === name);
  }
  getNeighbour(name){
    return this.neighbourNodes.find(person => person.name === name);
  }
  addEdge(person1, person2,Nodes) {
      const Owner = this.getPerson(person1);

      if (Nodes === 'parent'){
            const parent = this.getParent(person2);
            Owner.addparents(parent);
      }
     else if (Nodes === 'sibling'){
        const sibling = this.getSibling(person2);
        Owner.addsiblings(sibling);
      }
      else {
        const neighbour = this.getNeighbour(person2)
        Owner.addneighbours(neighbour);
      }
      this.edges.push(`${person1} - ${person2}`);
 }

 print(){
   return this.peopleNodes.map(({parents,siblings,neighbours}) =>{

      return `parents  => `+"\n\t"+`Name`+"\t\t"+`Identification card`+"\t"+"Phone Number\n"
      +`${parents.map(parent =>"\t"+ `${parent.name}`+"\t\t"+`${parent.noIc}`+"\t\t"+`${parent.noPhone}`+"\n").join('')}`+'\n'+
      `siblings  => `+"\n\t"+`Name`+"\t\t"+`Identification card`+"\t"+"Phone Number\n"
        +`${siblings.map(sibling =>"\t"+ `${sibling.name}`+"\t\t"+`${sibling.noIc}`+"\t\t"+`${sibling.noPhone}`+"\n").join('')}`+'\n'
        +`neighbours  => `+"\n\t"+`Name`+"\t\t"+`Identification card`+"\t"+"Phone Number\n"
        +`${neighbours.map(neighbour =>"\t"+ `${neighbour.name}`+"\t\t"+`${neighbour.noIc}`+"\t\t"+`${neighbour.noPhone}`+"\n").join('')}`+'\n';
   }).join('\n')
 }
}
module.exports = {
  newCreate: function() {
    return new Graph();
  },
};
