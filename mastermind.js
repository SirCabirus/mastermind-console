/**************************************************************************************
  Mastermind für Console

  Programmiert von Frank Wolter

  Version 5 vom 18.10.2022

  prompt-sync muss installiert sein
  npm install prompt-sync

  Aufruf: node mastermind.js [parm]

  parm ist optional und ein beliebiger Parameter
  ist er nicht vorhanden sind alle Zahlen im Code nur einmal vorhanden
  ist der Parameter vorhanden können Zahlen im Code mehrfach vorhanden sein

  Eine Codeziffer an der richtigen Stelle 
  gibt ein B zurück

  Eine Codeziffer an einer anderen Stelle
  gibt ein C zurück

***************************************************************************************/

const parms = process.argv;
let unique; // Flag ob der Code jede Zahl nur einmal enthalten darf oder auch mehrmals

// parm[2] ist der erste beim Aufruf übergebene Parameter
if (parms[2] == undefined) {
  // wenn es keinen Aufrufparameter gibt
  unique = true;
} else {
  // wenn es irgendeinen Aufrufparameter gibt
  unique = false;
}

const MAXTRIES = 12; // Anzahl der maximal möglichen Versuche den Code zu knacken
const CODELENGTH = 4; // Länge des zu ermittelnden Codes

let tries = MAXTRIES; // Anzahl der noch möglichen Versuche den Code zu knacken
let checkString; // die Auswertung der Eingabe
let guess; // speichert die Eingabe eines Rateversuchs in einem Array
let solved = false; // Flag ob Code geknackt wurde


let mastermindCode = [];
mastermindCode = createCodeArray(CODELENGTH, 1, 8, unique); // Mastermind-Code erzeugen
// mastermindCode = [8, 3, 7, 8]; // Test
// mastermindCode = [8, 3, 7, 8]; // Test
// Ausgabe des zu suchenden Codes nur für die Entwicklung
console.log("Der Code ist: " + mastermindCode.join(""));

gameExplanation(); // Ausgabe der Spielerklärung

// gameloop start
do {
  guess = getUserInput(CODELENGTH); // Rateversuch von Console einlesen
  tries--;
  checkString = compareInput(guess, mastermindCode); // Rateversuch auswerten
  if (isArrayEqual(guess, mastermindCode)) { // wenn die Lösung gefunden wurde Abfrageschleife verlassen
    solved = true;
  } else {
    console.log("-> " + checkString + "  du hast noch " + tries + " Versuche."); // sonst Auswertung anzeigen
  }
} while (!solved && tries > 0);
// gameloop end

if (solved) {
  console.log("Du hast den Code mit " + (MAXTRIES - tries) + " Versuchen geknackt!");
} else {
  console.log(
    "Du hast leider verloren. Der gesuchte Code ist: " + mastermindCode.join("")
  );
}

/**************************************************
 * Nimmt einen String aus der Console entgegen.
 * Der String muss len Ziffern zwischen 1 und 8
 * ohne andere Zeichen enhalten
 * @param {*} len die Länge des Arrays
 * @returns die Eingabe als Array (typeof number)
 **************************************************/
function getUserInput(len) {
  const prompt = require("prompt-sync")();
  let number;
  let valid = false;

  do {
    number = prompt("Gib " + len + " Ziffern ohne Zwischenraum ein: ");
    valid = checkNumber(number, len);
  } while (!valid);
  
  // Eingbestring in Array von String umwandeln
  const userStringInputArray = number.split("");
  // String Array in Number Array umwandeln
  const userNumberInputArray = userStringInputArray.map((str) => {
    return Number(str);
  });
  return userNumberInputArray;
}

/******************************************************************************************
 * Überprüft ob der übergebene String die geforderte Länge hat und nur aus den 
 * Ziffern 1 bis 8 besteht
 * @param {*} str der zu untersuchende String
 * @param {*} len die geforderte Länge des Strings
 * @returns true wenn der String die Bedingungen erfüllt, sonst false
 ******************************************************************************************/
function checkNumber(str, len) {
  let result = false;

  if (str.length != len || isNaN(str) || str.includes("0") || str.includes("9")) {
    console.log("Die Eingabe muss genau " + CODELENGTH + " Ziffern zwischen 1 und 8 enthalten!");
  } else {
    result = true;
  }
  return result;
}

/****************************************************************
 * Erzeugt ein Array der Länge len mit Zahlen (typeopf number) 
 * zwischen min und max.
 * Einzelne Zahlen können mehrfach im Array enthalten sein. 
 * @param {*} len die gewünschte Länge des Arrays
 * @param {*} min die kleinste Ziffer
 * @param {*} max die größte Ziffer
 * @returns das erzeugte Array
 ****************************************************************/
function createCodeArray(len, min, max, unique) {
  let codeArray = [];
  let number;
  for (i = 0; i < len; i++) {
    let success = false;
    do {
      number = rand(min, max);
      if (unique) {
        if (!codeArray.includes(number)) {
          success = true;
        } else {
          console.log("Zahl " + number + " bereits enthalten");
        }
      } else {
        success = true;
      }
    } while (!success);
    codeArray[i] = number;
  }
  return codeArray;
}

/**********************************************************
 * Gibt eine Zufallszahl aus der
 * Zahlenmenge min bis max zurück
 * @param {*} min kleinste Zahl
 * @param {*} max größte Zahl
 * @returns Zufallszahl aus der Zahlenmenge min bis max
 **********************************************************/
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**********************************************************
 * Vergleicht zwei Arrays
 * @param {*} a1 das erste Array
 * @param {*} a2 das zweite Array 
 * @returns true wenn die Arrays gleich sind, sonst false
 **********************************************************/
function isArrayEqual(a1, a2) {
  isEqual =
    a1.length === a2.length &&
    a1.every((value, index) => value === a2[index]);
    return isEqual;
}

/**********************************************************************
 * Vergleicht das Array userArray mit dem Array mastermindArray.
 * Wenn beide Arrays an derselben Position die gleiche
 * Zahl haben, wird im Ausgabestring das Zeichen B notiert.
 * Wenn die betrachtete Zahl des userArray im mastermindArray
 * an einer anderen Stelle vorkommt, wird im Ausgabestring 
 * ein C notiert.
 * Der Ausgabestring enthält das Ergebnis aller B und C Ergebnisse  
 * @param {*} userArray 
 * @param {*} mastermindArray 
 * @returns Ausgabestring
 **********************************************************************/
function compareInput(userArray, mastermindArray) {
  let hit = ""; // wird mit B für jede richtige Zahl auf gleicher Position belegt
  let pos = ""; // wird mit C für jede richtige Zahl auf anderer Position belegt
  let result = ""; // das Gesamtergebnis aus hit und pos

  // Arrays kopieren, wir arbeiten mit der Kopie
  // da die Arrays temporär verändert werden um erratene Zahlen auszuklammern
  let userArrayCopy = [...userArray];
  let masterMindArrayCopy = [...mastermindArray];

  // Überprüfen gleiche Zahl auf gleicher Position
  for (i = 0; i < userArrayCopy.length; i++) {
    if (userArrayCopy[i] == masterMindArrayCopy[i]) {
      // erratene Zahlen werden ausgeklammert, damit sie nicht mehrfach ausgewertet werden
      // dazu werden die Zahlen in den beiden Arrays mit 0 und 9 belegt, da diese Zahlen
      // im Code nicht vorkommen und für jedes Array unterschiedlich sind
      masterMindArrayCopy[i] = 0; // diese Zahl macht nicht mehr mit
      userArrayCopy[i] = 9; // diese Zahl macht nicht mehr mit
      hit += "B";
    }
  }

  // Überprüfen gleiche Zahl auf anderer Position
  for (x = 0; x < userArrayCopy.length; x++) {
    for (y = 0; y < masterMindArrayCopy.length; y++) {
      if (userArrayCopy[x] == masterMindArrayCopy[y]) {
        masterMindArrayCopy[y] = 0; // diese Zahl macht nicht mehr mit
        pos += "C";
        break; // für diese Zahl sind wir fertig und verlassen die Schleife damit es keine mehrfache Auswertung gibt
      }
    }
  }

  result = hit + pos;

  return result;
}

/********************************************************************
 * Diese Variante funktioniert nicht - es wird noch daran gearbeitet
 * 
 * Vergleicht das Array userArray mit dem Array mastermindArray.
 * Wenn beide Arrays an derselben Position die gleiche
 * Zahl haben, wird im Ausgabestring das Zeichen B notiert.
 * Wenn die betrachtete Zahl des userArray im mastermindArray
 * an einer anderen Stelle vorkommt, wird im Ausgabestring 
 * ein C notiert.
 * Der Ausgabestring enthält das Ergebnis aller B und C Ergebnisse  
 * @param {*} userArray 
 * @param {*} mastermindArray 
 * @returns Ausgabestring
 ********************************************************************/
function compareInputPrototype(userArray, mastermindArray) {
  let hit = ""; // wird mit B für jede richtige Zahl auf gleicher Position belegt
  let pos = ""; // wird mit C für jede richtige Zahl auf anderer Position belegt
  let result = ""; // das Gesamtergebnis aus hit und pos

  for (x = 0; x < userArray.length; x++) {
    for (y = 0; y < mastermindArray.length; y++) {
      if (userArray[x] == mastermindArray[y]) {
        if (x == y) {
          hit += "B";
        } else {
          pos += "C";
        }
        break; // für diese Zahl sind wir fertig und verlassen die Schleife damit es keine mehrfache Auswertung gibt
      }
    }
  }

  result = hit + pos;

  return result;
}

/******************************
 * Ausgabe der Spielerklärung
 ******************************/
function gameExplanation() {
  console.log("");
  console.log("                            Mastermind");
  console.log("");
  console.log(" Knacke einen " + CODELENGTH + "-stelligen Code, der aus den Ziffern 1 bis 8 besteht.");
  if (unique) {
    console.log(" Jede Ziffer kann nur einmal im Code enthalten sein. Gib dazu eine Zahl aus " + CODELENGTH + " Ziffern ein.");
  } else {
    console.log(" Jede Ziffer kann mehrmals im Code enthalten sein. Gib dazu eine Zahl aus " + CODELENGTH + " Ziffern ein.");
  }
  console.log(" Der Computer vergleicht die Eingabe mit dem Code und gibt eine Rückmeldung.");
  console.log(" Für jede Ziffer, die an der richtigen Stelle steht, wird ein B ausgegeben.");
  console.log(" Für jede Ziffer, die im Code an einer anderen Stelle steht wird ein C ausgegeben.");
  console.log(" Du hast " + MAXTRIES + " Versuche den Code zu knacken.");
  console.log("");
}

