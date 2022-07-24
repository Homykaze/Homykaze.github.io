"use strict";

//Columns and cols
let rows = 27;
let cols = 76;
//Coordinates of starting node
let xs = 11;
let ys = 24;
//Coordinates of finish node
let xf = 11;
let yf = 49;

//Table array which is displayed 
let cells = [];
//Numerical copy of the array to keep data about progress of genereation of path
let cells_copy = [];
//List to keep track of paths, each node contains x- and y-coordinates with node's (created after initialization of classes)
let list_of_paths = [];
let nodez = 0;

//Event listener variable - allows us to drag mouse over the grid to draw and erase walls
let mouseIsPressed = false;

make_grid();


//Complete
//This function creates the grid of table cells
function make_grid()
{
    let tbl = document.getElementById("output");
    for (let i = 0; i < rows; i++)
    {
        //Turning an array into a two-dimensional array
        cells[i] = []; 
        cells_copy[i] = [];
        //Creation of a new row
        let newRow = document.createElement("tr");
        newRow.id = "row" + i;
        //Appending it to the table
        tbl.appendChild(newRow);
        let rowW = document.getElementById("row" + i);

        for (let j = 0; j < cols; j++)
        {
            //Storing cell of a table in the 2-dimensional array
            cells[i][j] = document.createElement("td");
            cells[i][j].id = i + "-" + j;
            cells_copy[i][j] = -1;

            if (i == 11 && j == 24)
                cells[i][j].className = "startnode";
            else if (i == 11 && j == 49)
                cells[i][j].className = "finishnode";
            else
                cells[i][j].className = "unvisited";
            
            //Event listener for when a mouse click has just happened
            cells[i][j].onmousedown = function() {
                mouseIsPressed = true; 
                if (this.className == "unvisited")
                    this.className = "wall"; 
                else if (this.className == "wall")
                    this.className = "unvisited"; 
            };

            //Event listener for when a mouse is held
            cells[i][j].onmouseover = function() {
                if (mouseIsPressed == true)
                {
                    if (this.className == "unvisited")
                        this.className = "wall"; 
                    else if (this.className == "wall")
                        this.className = "unvisited"; 
                }
            };

            //Mouse is no longer pressed
            cells[i][j].onmouseup = function() { 
                mouseIsPressed = false; 
            };
            //Appending it to the row
            rowW.appendChild(cells[i][j]);
        }    
    }
}

//Complete
//This function allows the user to change the starting node
function changestart()
{
    clearpath();
    //Find current starting node by checking each element of the grid
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            //When found, make it empty
            if (cells[i][j].className == "startnode")
            {
                cells[i][j].className = "unvisited";
            }
            //Redefining onmousedown function to not create walls, but to create starting nodes
            cells[i][j].onmousedown = function() { 
                if (this.className == "unvisited")
                {
                    this.className = "startnode";
                    xs = i;
                    ys = j;
                    //Once a starting node is placed, we redifine onmouse function again to build walls for each cells
                    for (let a = 0; a < rows; a++)
                    {
                        for (let b = 0; b < cols; b++)
                        {
                            cells[a][b].onmousedown = function() {
                                mouseIsPressed = true;  
                                if (this.className == "unvisited")
                                    this.className = "wall"; 
                                else if (this.className == "wall")
                                    this.className = "unvisited"; 
                            };
                        }
                    }
                }
            };
        }
    }
}

//Complete
//This function allows the user to change the finish node
function changefinish()
{
    clearpath();
    //Find current finish node by checking each element of the grid
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            //When found, make it empty
            if (cells[i][j].className == "finishnode")
            {
                cells[i][j].className = "unvisited";
            }
            //Redefining onmousedown function to not create walls, but to create finish nodes
            cells[i][j].onmousedown = function() { 
                if (this.className == "unvisited")
                {
                    this.className = "finishnode";
                    xf = i;
                    yf = j;
                    //Once a finish node is placed, we redifine onmouse function again to build walls for each cells
                    for (let a = 0; a < rows; a++)
                    {
                        for (let b = 0; b < cols; b++)
                        {
                            cells[a][b].onmousedown = function() {
                                mouseIsPressed = true;   
                                if (this.className == "unvisited")
                                    this.className = "wall"; 
                                else if (this.className == "wall")
                                    this.className = "unvisited"; 
                            };
                        }
                    }
                }
            };
        }
    }
}

//Complete
//This function clears the board off the wall nodes and path ones
function clearboard()
{
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (cells[i][j].className == "wall" || cells[i][j].className == "path")
                cells[i][j].className = "unvisited";
        }
    }
    
    for (let i = 0; i < nodez; i++)
    {
        list_of_paths[i] = [];
    }
    list_of_paths = [];

    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            cells_copy[i][j] = -1;
        }
    }
    nodez = 0;
}

//Complete
//This function clears the board off the wall nodes and path ones
function clearpath()
{
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (cells[i][j].className == "path")
                cells[i][j].className = "unvisited";
        }
    }
    
    for (let i = 0; i < nodez; i++)
    {
        list_of_paths[i] = [];
    }
    list_of_paths = [];

    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            cells_copy[i][j] = -1;
        }
    }
    nodez = 0;
}

//Pathfinding algorithm functions are below
//Complete
//Checks if there are any same nodes in the list and returns a boolean value
function check_same(x, y)
{
    for (let i = 0; i < nodez; i++)
    {
        if (list_of_paths[i][0] == x && list_of_paths[i][1] == y)
            return true;
    }
    return false;
}

//Complete
//Add node to the list
function get_new(x, y, val)
{
    list_of_paths[nodez] = [x, y, val];
    nodez++;
}

//Complete
//This function creates a sublist of max 4 nodes based on the current tile's coordinates
function expand_list(x, y, val)
{
    //Check for the upper cell if we can go there
    if (y - 1 > -1)
    {
        if (cells[x][y - 1].className == "unvisited" || cells[x][y - 1].className == "finishnode")
        {
            cells_copy[x][y - 1] = val + 1;
                cells[x][y - 1].className = "path";
            //Check for presence of the same coordinate in the list
            if (check_same(x, y - 1) == false)
                get_new(x, y - 1, val + 1);
        }
    }

    //Check for the right cell if we can go there
    if (x + 1 < rows)
    {
        if (cells[x + 1][y].className == "unvisited" || cells[x + 1][y].className == "finishnode")
        {
            cells_copy[x + 1][y] = val + 1;
                cells[x + 1][y].className = "path";
            //Check for presence of the same coordinate in the list
            if (check_same(x + 1, y) == false)
                get_new(x + 1, y, val + 1);
        }
    } 

    //Check for the lower cell if we can go there
    if (y + 1 < cols)
    {
        if (cells[x][y + 1].className == "unvisited" || cells[x][y + 1].className == "finishnode")
        {
            cells_copy[x][y + 1] = val + 1;
                cells[x][y + 1].className = "path";
            //Check for presence of the same coordinate in the list
            if (check_same(x, y + 1) == false)
                get_new(x, y + 1, val + 1);
        }
    }

    //Check for the left cell if we can go there
    if (x - 1 > -1)
    {
        if (cells[x - 1][y].className == "unvisited" || cells[x - 1][y].className == "finishnode")
        {
            cells_copy[x - 1][y] = val + 1;
                cells[x - 1][y].className = "path";
            //Check for presence of the same coordinate in the list
            if (check_same(x - 1, y) == false)
                get_new(x - 1, y, val + 1);
        }
    }
}

//Annimation needed

//Complete
//Check for presence of starting and finishing nodes
function some_nodes_are_missing()
{ 
    let start = false;
    let finish = false;
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (cells[i][j].className == "startnode")
                start = true;
            if (cells[i][j].className == "finishnode")
                finish = true;
        }
    }
    if (start == false)
        alert("Starting node is missing!");
    else if (finish == false)
        alert("Finish node is missing!");
    else if (finish == false && start == false)
        alert("Starting and finishing nodes are missing!");
    else    
        return false;
    return true;
}

//Animation needed
//This function implements sample pathfinding algorithm with the use of a linked list and a numerical copy of the matrix
function generatepath()
{
    clearpath();
    if (some_nodes_are_missing() == true)
        return;
    else
    {
        get_new(xs, ys, 0);
        for (let i = 0; i < nodez && (list_of_paths[i][0] != xf || list_of_paths[i][1] != yf) && list_of_paths[i][2] != rows * cols; i++)
        {   
            expand_list(list_of_paths[i][0], list_of_paths[i][1], list_of_paths[i][2]);
        }
        cells[xf][yf].className = "finishnode";
        get_path(xf, yf, cols*rows);
    }
}

//Make shortest route visible
function get_path(cur_x, cur_y, cur_value)
{
    let breaking_counter = 0;
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (cells[i][j].className == "path")
            {
                cells[i][j].className = "unvisited";
            }
                
        }
    }

    while (cur_value > 1 && breaking_counter < cols*rows)
    {
        breaking_counter++;
        let up = false, right = false, down = false, left = false;
        if (cur_y - 1 > -1)
        {
            if (cells_copy[cur_x][cur_y - 1] < cur_value && cells_copy[cur_x][cur_y - 1] != -1)
            {
                cur_value = cells_copy[cur_x][cur_y - 1];
                up = true;
            }
        }
        if (cur_x + 1 < rows)
        {
            if (cells_copy[cur_x + 1][cur_y] < cur_value && cells_copy[cur_x + 1][cur_y] != -1)
            {
                cur_value = cells_copy[cur_x + 1][cur_y];
                up = false;
                right = true;
                down = false;
                left = false;
            }
        }
        if (cur_y + 1 < cols)
        {
            if (cells_copy[cur_x][cur_y + 1] < cur_value && cells_copy[cur_x][cur_y + 1] != -1)
            {
                cur_value = cells_copy[cur_x][cur_y + 1];
                up = false;
                right = false;
                down = true;
                left = false;
            }
        }
        if (cur_x - 1 > -1)
        {
            if (cells_copy[cur_x - 1][cur_y] < cur_value && cells_copy[cur_x - 1][cur_y] != -1)
            {
                cur_value = cells_copy[cur_x - 1][cur_y];
                up = false;
                right = false;
                down = false;
                left = true;
            }
        }
        if (up == true)
            cur_y--;
        else if (right == true)
            cur_x++;
        else if (down == true)
            cur_y++;
        else if (left == true)
            cur_x--;
        //setTimeout(function() {
        cells[cur_x][cur_y].className = "path";
        //}, delayInMilliseconds);

        if (breaking_counter >= cols*rows)
        {
            alert("This algorithm is not ready for that.");
            cells[xf][yf].className = "finishnode";
        }
    }
}

//Complete
//Helper function for maze generation that randomizes numbers between certain values, both inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min - 1);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min + 1); //Both max and min are inclusive
}

//Recursive division maze generation
function generatemaze()
{
    clearboard();
    //Walls surround the grid
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if ((i == 0 || j == 0 || i == rows - 1 || j == cols - 1) && cells[i][j].className == "unvisited")
            {
                cells[i][j].className = "wall";
            }
        }
    }
    //Recursive call
    dividedown(0, 0, rows, cols);
}

//Helper function that builds cross of walls in a certain range and makes 3 out of 4 holes in them
function get_cross(ys, xs, y, x, wall_y, wall_x)
{
    let solid = getRandomInt(0, 3);
    //Cross of walls
    for (let i = ys; i < y; i++)
    {
        for(let j = xs; j < x; j++)
        {
            if ((i == wall_y || j == wall_x) && cells[i][j].className == "unvisited")
            {
                cells[i][j].className = "wall";
            }
            
        }
    }
    
    //Hole makery
    //Upper wall has no walk-through
    if (solid == 0)
    {
        let hole = getRandomInt(wall_x + 1, x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
        hole = getRandomInt(wall_y + 1, y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
        hole = getRandomInt(xs + 1, wall_x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
    }
    //Right wall has no hole
    else if (solid == 1)
    {
        let hole = getRandomInt(ys + 1, wall_y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
        hole = getRandomInt(wall_y + 1, y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
        hole = getRandomInt(xs + 1, wall_x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
    }
    //Lower wall has no hole
    else if (solid == 2)
    {
        let hole = getRandomInt(ys + 1, wall_y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
        hole = getRandomInt(wall_x + 1, x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
        hole = getRandomInt(xs + 1, wall_x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
    }
    //Left wall has no hole
    else
    {
        let hole = getRandomInt(ys + 1, wall_y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
        hole = getRandomInt(wall_x + 1, x - 2);
        if (cells[wall_y][hole].className == "wall")
            cells[wall_y][hole].className = "unvisited";
        hole = getRandomInt(wall_y + 1, y - 2);
        if (cells[hole][wall_x].className == "wall")
            cells[hole][wall_x].className = "unvisited";
    }

    //Fix, when a wall is drawn from a hole
    if (cells[ys - 1][wall_x].className != "wall")
    {
        cells[ys][wall_x].className = "unvisited";
        for (let i = ys + 1; i < wall_y; i++)
        {
            if (cells[i][wall_x].className == "unvisited")
                cells[i][wall_x].className = "wall";
        }
    }
    if (cells[wall_y][xs - 1].className != "wall")
    {
        cells[wall_y][xs].className = "unvisited";
        for (let j = xs + 1; j < wall_x; j++)
        {
            if (cells[wall_y][j].className == "unvisited")
                cells[wall_y][j].className = "wall";
        } 
    }
    if (y < rows)
    {
        if (cells[y][wall_x].className != "wall")
        {
            cells[y - 1][wall_x].className = "unvisited";
            for (let i = y - 2; i > wall_y; i--)
            {
                if (cells[i][wall_x].className == "unvisited")
                    cells[i][wall_x].className = "wall";
            } 
        }
    }
    if (x < cols)
    {
        if (cells[wall_y][x].className != "wall")
        {
            cells[wall_y][x - 1].className = "unvisited";
            for (let j = x - 2; j > wall_x; j--)
            {
                if (cells[wall_y][j].className == "unvisited")
                    cells[wall_y][j].className = "wall";
            }  
        }   
    }
    
}


function dividedown(ys, xs, y, x)
{
    //Generating a random number between the allowable range of the given chamber
    let wall_x = getRandomInt(xs + 2, x - 3);
    let wall_y = getRandomInt(ys + 2, y - 3);

    //Base call
    if (y - ys < 5 || x - xs < 5)
    {      
        return;
    }

    get_cross(ys + 1, xs + 1, y, x, wall_y, wall_x);

    //Recursive calls 1 - upper left, 2 - upper right, 3 - bottom right, 4 - bottom left
    dividedown(ys, xs, wall_y, wall_x);
    dividedown(ys, wall_x, wall_y, x);
    dividedown(wall_y, wall_x, y, x);
    dividedown(wall_y, xs, y, wall_x);
}

