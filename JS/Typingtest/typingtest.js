"use strict";

//Dom elements
const inputBar = document.querySelector('#userInput');
const resetButton = document.querySelector('#reset');
const outputBar = document.querySelector('#outputWords');
const score = document.querySelector('#score');
const countdown = document.querySelector('#timer');
const result = document.querySelector('#result');
//List of words
const words = [];
//Time variables
const startingSeconds = 60;
let time = startingSeconds * 100;
var interval;
//Booleans for the interval
let typingStarted = false;
let timerRunning = false;
let readyToStart = true;
//Words counter
let correctWords = 0;
//Buffer symbols
let extraSymbols = '';
let pastSpace = false;
let fullWord = "";
//Characters taken by words in the output section
let charactersTaken = 0;

//Listening for Enter or Space clicks to remove words and update the counter
inputBar.addEventListener('keyup', function(e) {
    if (e.keyCode === 13|| e.keyCode === 32){
        if (e.code === "Enter"){
            e.target.value += " ";
        }
        //If the typer is really quick
        for (let i = 0; i < e.target.value.length; ++i){
            if (pastSpace){
                extraSymbols += e.target.value[i];
            } else {
                fullWord += e.target.value[i];
            }
            if (e.target.value[i] === " " && i != 0){
                pastSpace = true;
            }
        }
        if (fullWord === outputBar.firstChild.textContent){
            ++correctWords;
            score.innerHTML = correctWords;
            //Color carousel
            let red, green, blue;
            if (correctWords <= 10){
                red = 20 + correctWords * 23;
                green = 33 - correctWords * 3;
                blue = 61 - correctWords * 6;
                //Getting to red 250 3 1 from dark blue 20 33 61
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            }
            else if (correctWords <= 20){
                red = 255 - 2 * (correctWords - 10);
                green = 9 * (correctWords - 10);
                blue = 5 * (correctWords - 10);
                //Getting to red-orange 235 90 50 from pure red 255 0 0
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else if (correctWords <= 30) {
                red = 235;
                green = 90 + (correctWords - 20) * 12;
                blue = 50;
                //Getting yellow 235 200 50
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else if (correctWords <= 40) {
                red = 235 - (correctWords - 30) * 5;
                green = 205 + (correctWords - 30) * 5;
                blue = 50;
                //Getting acid-green 180 255 50
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else if (correctWords <= 50) {
                red = 180 - (correctWords - 40) * 18;
                green = 250 - (correctWords - 40) * 4;
                blue = 50;
                //Getting nice-green 0 210 50
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else if (correctWords <= 60) {
                red = 0;
                green = 210 - (correctWords - 50) * 3;
                blue = 50 + (correctWords - 50) * 15;
                //Getting light-blue 0 180 200
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else if (correctWords <= 70) {
                red = (correctWords - 60) * 10;
                green = 180 - (correctWords - 60) * 18;
                blue = 200;
                //Getting purple 100 0 200
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            } else {
                red = 160 - correctWords;
                green = 0;
                blue = 255 - correctWords;
                //Getting to black
                score.style.color = "rgb(" + red + "," + green + "," + blue + ")";
            }
        }
        charactersTaken -= (outputBar.firstChild.length - 1);
        outputBar.firstChild.remove();
        if (extraSymbols){
            e.target.value = extraSymbols;
            extraSymbols = '';
        } else {
            e.target.value = "";
        }
        pastSpace = false;
        displayWords();
    }
    if (time <= 0){
        e.target.value = "";
        score.innerHTML = correctWords;
    }
    fullWord = "";
});
//Event listener to start the timer
inputBar.addEventListener('keydown', function() {
    //Starting up the timer
    if (!typingStarted && !timerRunning && readyToStart){
        typingStarted = true;
        timerRunning = true;
        readyToStart = false;
        interval = setInterval(updateCountdown, 10);
    }
});
//Reset button event listener
resetButton.addEventListener('click', function() {
    //Display words again and hide result
    outputBar.className = "visible";
    result.className = "invisible";
    //Resetting the booleans
    typingStarted = false;
    timerRunning = false;
    readyToStart = true;
    //Resetting the time
    clearInterval(interval);
    time = startingSeconds * 100;
    countdown.innerHTML = "60:00";
    //Reset the word count
    correctWords = 0;
    score.innerHTML = correctWords;
    score.style.color = "#14213d";
    //Empty the input bar
    inputBar.value = "";
});


//Get random number function
const getRandomInt = (max) => Math.floor(Math.random() * max);
//Add words to the output section in DOM
function displayWords() {
    while (charactersTaken < 146) {
        let currentWord = words[getRandomInt(211)];
        outputBar.appendChild(document.createTextNode(currentWord + ' '));
        charactersTaken += currentWord.length;
    }
}
//Update time function
function updateCountdown(){
    if (typingStarted && timerRunning){
        const seconds = Math.floor(time/100);
        let centiseconds = time % 100;
    
        centiseconds = centiseconds < 10 ? '0' + centiseconds : centiseconds;
        countdown.innerHTML = `${seconds}:${centiseconds}`;
        time--;
        if (time < 0){
            displayResult();
            typingStarted = false;
            timerRunning = false;
            outputBar.className = "invisible";
        }
    }
}
//Setting up the result element and its display function
function displayResult() {
    let wps = correctWords/60;
    wps = wps.toFixed(2);
    //Display results and hide words
    result.innerHTML = `Your typing speed is ${correctWords} WPM or ${wps} WPS.`;
    result.className = "visible";
}

//Setting up words
setWords();
//Fill in the output section
displayWords();

//Setting up words
function setWords() {
    words[0] = "ability";
    words[1] = "about";
    words[2] = "above";
    words[3] = "absolute";
    words[4] = "adult";
    words[5] = "afraid";
    words[6] = "African";
    words[7] = "ahead";
    words[8] = "and";

    words[9] = "bathroom";
    words[10] = "battery";
    words[11] = "beautiful";
    words[12] = "because";
    words[13] = "below";
    words[14] = "better";
    words[15] = "border";
    words[16] = "breakfast";
    words[17] = "brush";
    words[18] = "buy";
    words[19] = "break";

    words[20] = "cable";
    words[21] = "call";
    words[22] = "camera";
    words[23] = "center";
    words[24] = "chance";
    words[25] = "change";
    words[26] = "charge";
    words[27] = "clean";
    words[28] = "classroom";
    words[29] = "classic";
    words[30] = "cloud";
    words[31] = "coffee";
    words[32] = "cost";
    words[33] = "crew";
    words[34] = "currently";

    words[35] = "damage";
    words[36] = "dangerous";
    words[37] = "dark";
    words[38] = "data";
    words[39] = "dead";
    words[40] = "deliver";
    words[41] = "depth";
    words[42] = "dark";
    words[43] = "design";
    words[44] = "detail";
    words[45] = "development";
    words[46] = "device";
    words[47] = "dimension";
    words[48] = "dirt";
    words[49] = "discovery";
    words[50] = "discussion";
    words[51] = "document";
    words[52] = "dream";
    words[53] = "driver";

    words[54] = "earth";
    words[55] = "economics";
    words[56] = "educational";
    words[57] = "effective";
    words[58] = "efficiency";
    words[59] = "effort";
    words[60] = "emission";
    words[61] = "employee";
    words[62] = "empty";
    words[63] = "engineering";
    words[64] = "English";
    words[65] = "European";
    words[66] = "exactly";

    words[67] = "face";
    words[68] = "family";
    words[69] = "fashion";
    words[70] = "father";
    words[71] = "feeling";
    words[72] = "fifteen";
    words[73] = "finance";
    words[74] = "flower";
    words[75] = "focus";
    words[76] = "food";
    words[77] = "forever";
    words[78] = "forward";
    words[79] = "friendly";
    words[80] = "frequently";
    words[81] = "furniture";

    words[82] = "garage";
    words[83] = "garlic";
    words[84] = "gender";
    words[85] = "German";
    words[86] = "girlfriend";
    words[87] = "global";
    words[88] = "golden";
    words[89] = "greatest";
    words[90] = "guarantee";

    words[91] = "hand";
    words[92] = "have";
    words[93] = "health";
    words[94] = "helicopter";
    words[95] = "highlight";
    words[96] = "history";
    words[97] = "honest";
    words[98] = "however";
    words[99] = "hungry";

    words[100] = "idea";
    words[101] = "illegal";
    words[102] = "immediately";
    words[103] = "implement";
    words[104] = "importance";
    words[105] = "include";
    words[106] = "index";
    words[107] = "Indian";
    words[108] = "install";

    words[109] = "Japanese";
    words[110] = "Jewish";
    words[111] = "judge";
    words[112] = "juice";
    words[113] = "just";
    words[114] = "junior";
    words[115] = "joke";
    words[116] = "job";
    words[117] = "join";

    words[118] = "keep";
    words[119] = "kitchen";
    words[120] = "kind";
    words[121] = "know";
    words[122] = "knowledge";

    words[123] = "land";
    words[124] = "languages";
    words[125] = "large";
    words[126] = "legal";
    words[127] = "little";
    words[128] = "live";

    words[129] = "machine";
    words[130] = "mean";
    words[131] = "member";
    words[132] = "message";
    words[133] = "might";
    words[134] = "minute";
    words[135] = "modern";
    words[136] = "moment";
    words[137] = "music";

    words[138] = "name";
    words[139] = "need";
    words[140] = "night";
    words[141] = "nothing";
    words[142] = "number";

    words[143] = "occur";
    words[144] = "office";
    words[145] = "often";
    words[146] = "operation";
    words[147] = "organization";
    words[148] = "others";
    words[149] = "outside";
    words[150] = "over";

    words[151] = "painting";
    words[152] = "particularly";
    words[153] = "pattern";
    words[154] = "performance";
    words[155] = "phone";
    words[156] = "place";
    words[157] = "picture";
    words[158] = "population";
    words[159] = "president";
    words[160] = "project";
    words[161] = "public";

    words[162] = "quality";
    words[163] = "question";
    words[164] = "quickly";
    words[165] = "quite";

    words[166] = "rate";
    words[167] = "rather";
    words[168] = "reach";
    words[169] = "reality";
    words[170] = "remain";
    words[171] = "right";
    words[172] = "road";
    words[173] = "room";

    words[174] = "same";
    words[175] = "school";
    words[176] = "season";
    words[177] = "shoulder";
    words[178] = "significant";
    words[179] = "skill";
    words[180] = "small";
    words[181] = "something";
    words[182] = "success";
    words[183] = "system";

    words[184] = "table";
    words[185] = "teacher";
    words[186] = "themselves";
    words[187] = "timer";
    words[188] = "together";
    words[189] = "traditional";
    words[190] = "turn";
    words[191] = "TV";
    words[192] = "type";

    words[193] = "understand";
    words[194] = "until";
    words[195] = "usually";
    words[196] = "use";

    words[197] = "value";
    words[198] = "view";
    words[199] = "visit";
    words[200] = "voice";

    words[201] = "watch";
    words[202] = "weapon";
    words[203] = "western";
    words[204] = "whether";
    words[205] = "weather";
    words[206] = "window";

    words[207] = "year";
    words[208] = "young";
    words[209] = "yourself";

    words[210] = "zebra";
}
//Overlay funcitons, not related to the project
const on = () => document.getElementById("overlay").style.display = "block";
const off = () => document.querySelector("#overlay", "#introduction").style.display = "none";
