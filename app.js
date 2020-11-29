// Original https://github.com/udacity/Javascript

// Create Base (Animal) Class
function Animal(species, weight, height, diet) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.image = "images/" + species.toLowerCase() + ".png";
}

// Create Dino Object and Functions
/*  The JSON to pull fields from for my reference
    "species": "Triceratops",
    "weight": 13000,
    "height": 114,
    "diet": "herbavor",
    "where": "North America",
    "when": "Late Cretaceous",
    "fact": "First discovered in 1889 by Othniel Charles Marsh"
*/
function Dino(species, weight, height, diet, where, when, fact) {
  Animal.call(this, species, weight, height, diet);
  this.when = when;
  this.where = where;
  this.fact = fact; // Single Fact
  this.facts = []; // Array of Facts
}
// Create Dino Constructor
Dino.prototype = Object.create(Animal.prototype);
Dino.prototype.constructor = Dino;

// Create Dino Compare Method 1 (Weight)
Dino.prototype.compareWeight = function (weight, name) {
  const dinoWeight = Number(this.weight);
  const humanWeight = Number(weight);
  if (dinoWeight > humanWeight) {
    return `The ${this.species} weighs ${
      dinoWeight - humanWeight
    } lbs more than ${name}!`;
  } else {
    return `You are ${humanWeight - dinoWeight} lbs heavier than ${
      this.species
    }`;
  }
};

// Create Dino Compare Method 2 (Height)
Dino.prototype.compareHeight = function (height) {
  const dinoHeight = Number(this.height);
  const humanHeight = Number(height);
  const feetDiff = Math.floor((dinoHeight - humanHeight) / 12);
  const inchesDiff = (dinoHeight - humanHeight) % 12;
  if (dinoHeight > humanHeight) {
    return `${this.species} was ${feetDiff} feet ${inchesDiff} inches taller than you`;
  } else if (dinoHeight < humanHeight) {
    return `You are ${Math.abs(feetDiff)} feet ${Math.abs(
      inchesDiff
    )} inches taller than ${this.species}`;
  } else {
    return `You are as tall as ${this.species}`;
  }
};

// Create Dino Compare Method 3 (Diet)
Dino.prototype.compareDiet = function (diet) {
  if (this.diet === diet.toLowerCase()) {
    return `Like you, ${this.species} had ${this.diet} diet`;
  } else {
    return `Unlike you, ${this.species} had ${this.diet} diet`;
  }
};

// So I am storing multiple facts in the  dino.facts[]
// I will get a random value from the length to pull one 
// of the facts indexes. 
Dino.prototype.getRandomFact = function () {
  const index = Math.floor(Math.random() * 10) % this.facts.length;
  return this.facts[index];
};

// Create Human Object
// We use Animal as a base class as the "human" species
//  it is hardcoded as the HUman class will on only have 
//    the "human" species
// We assign a name in HUman which the Animal base class does not have
function Human(name, weight, height, diet) {
  Animal.call(this, "human", weight, height, diet);
  this.name = name;
}
// Create Human Constructor
Human.prototype = Object.create(Animal.prototype);
Human.prototype.constructor = Human;

let dinos = [];  // My Array of dino objects

// Buid the Array of dinos from JSON
// the fields match the json keys
fetch("dino.json")
  .then((response) => response.json())
  .then(
    (json) =>
      (dinos = json.Dinos.map(
        (dino) =>
          new Dino(
            dino.species,
            dino.weight,
            dino.height,
            dino.diet,
            dino.where,
            dino.when,
            dino.fact
          )
      ))
  );

// Use IIFE to get human data from form
function getHuman() {
  return (function () {
    const name = document.getElementById("name").value;
    let heightFeet = parseFloat(document.getElementById("feet").value);
    // Just in case I didn't enter a number
    if (isNaN(heightFeet)) {
      heightFeet = 0;
    }
    let heightInches = parseFloat(document.getElementById("inches").value);
    // Just in case I didn't enter a number
    if (isNaN(heightInches)) {
      heightInches = 0;
    }
    let weight = parseFloat(document.getElementById("weight").value);
    // Just in case I didn't enter a number
    if (isNaN(weight)) {
      weight = 0;
    }
    const diet = document.getElementById("diet").value;
    const heightInInches = heightFeet * 12 + heightInches;
    return new Human(name, weight, heightInInches, diet);
  })();
}

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", function () {
  const human = getHuman();
  // For Each dino add Compare and facts to randomize
  dinos.forEach((dino) => {
    dino.facts.push(dino.fact);
    // Compare weight fact
    const factWeight = dino.compareWeight(human.weight, human.name);
    dino.facts.push(factWeight);
    // Compare height fact
    const factHeight = dino.compareHeight(human.height);
    dino.facts.push(factHeight);
    // Compare diet fact
    const factDiet = dino.compareDiet(human.diet);
    dino.facts.push(factDiet);
  });
  // Hide Form from UI
  document.getElementById("dino-compare").style.display = "none";
  // Generate Grids and add back to DOM
  // This will generate a 9 x 9, counting the human in the middle
  for (let dinoIndex in dinos) {
    const dino = dinos[dinoIndex];
    let fact = dino.getRandomFact();
    // The pigeon's weight is 0.5, 
    // Use that as a key not to add a different fact
    if (dino.weight == 0.5) {
      // weight is less, ie its a bird
      fact = "All birds are dinosaurs.";
    }
    const gridItemDiv = getGridItem(dino.species, dino.image, fact);
    // Fill in the grid's item
    document.getElementById("grid").appendChild(gridItemDiv);
    // If you are in the middle Grid, you are Human
    if (dinoIndex == 3) {
      // insert human tile at center
      const humanTileDiv = getGridItem(human.species, human.image);
      // Append the Human Div
      document.getElementById("grid").appendChild(humanTileDiv);
    }
  }
});

// Find the Grid Item Area
// Add the species, image, and random fact
// Return the filled grid
function getGridItem(species, imageUrl, fact) {
  const gridItemDiv = document.createElement("div");
  gridItemDiv.className = "grid-item";

  // add species
  let speciesDiv = document.createElement("h3");
  speciesDiv.innerText = species;
  gridItemDiv.appendChild(speciesDiv);

  // add image
  let imageDiv = document.createElement("img");
  imageDiv.src = imageUrl;
  gridItemDiv.appendChild(imageDiv);

  // add fact, but there is non for human
  // Do not add if not found for human
  if (fact) {
    // for humans, facts are not necessary
    let factFiv = document.createElement("p");
    factFiv.innerText = fact;
    gridItemDiv.appendChild(factFiv);
  }

  return gridItemDiv;
}
