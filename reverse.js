function findPath () {
    let list = big_list.filter(a => a.length == 4);
    let start = document.getElementById('starting-word').value;
    let end = document.getElementById('ending-word').value;

    if (!list.includes(start) || !list.includes(end)) return;

    document.getElementById('starting-word').value = "";
    document.getElementById('ending-word').value = "";

    pathFromTo(start, end, list.filter(a => a != start), 0, []);
}

function pathFromTo(start, end, list) {
    let parents = [];
    let neighbors = [];
    neighbors.push(start);

    let done = false;
    while (!done) {
        let new_list = [];
        for (let i = 0; i < neighbors.length; i++) {
            let local_neighbors = getNeighbors(neighbors[i], list, parents);
            new_list = new_list.concat(local_neighbors);

            if (local_neighbors.includes(end)) {
                done = true;
            }
        }

        if (done) {
            break;
        }

        neighbors = new_list;
        list = list.filter(a => !neighbors.includes(a));
    }
    
    all_paths = [];
    getPaths(end, parents, []);
    updateHeaders(all_paths);
    printPaths(all_paths);
}

function updateHeaders(paths) {
    let answers = paths.length;
    let length = paths[0].length-1;

    let header = document.getElementsByClassName('subheading')[0];
    header.innerHTML = answers + " unique paths. " + length + " moves.";
}

function getAmountPerRow(paths) {
    let row_count = [];

    for (let i = 0; i < paths[0].length; i++) {
        let count = 0;
        let checked = [];
        for (let j = 0; j < paths.length; j++) {
            if (!checked[paths[j][i]]) {
                count++;
                checked[paths[j][i]] = true;
            }
        }
        row_count.push(count);
    }

    return row_count;
}

function printPaths(paths) {
    let canvas = document.getElementsByClassName('paths')[0];
    // canvas.width=700;//horizontal resolution (?) - increase for better looking text
    canvas.width = window.innerWidth;
    // canvas.height=500;//vertical resolution (?) - increase for better looking text
    canvas.height = paths[0].length * 75;
    canvas.style.width=canvas.width;//actual width of canvas
    canvas.style.height=canvas.height;//actual height of canvas
    
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let row_count = getAmountPerRow(paths);
    let words_drawn = [];
    let rows_drawn = new Array(paths[0].length).fill(0);
    
    
    for (let i = 0; i < paths.length; i++) {
        for (let j = 0; j < paths[i].length; j++) {
            
            if (!words_drawn[paths[i][j]]) {
                let size = Math.min(20, canvas.width/row_count[j]/3.8);
                let width = canvas.width;
                let height = canvas.height;
                ctx.font = size + "px Arial";
                
                let h = height/paths[i].length*(j+.5);
                let w = width/(row_count[j]+1)*(rows_drawn[j]+1);
                
                let r_x = w - 1.6*size;
                let r_y = h - 1.25*size;
                ctx.fillStyle = "#82BF88";
                ctx.fillRect(r_x, r_y, 3.2*size, 1.8*size);
                
                ctx.strokeStyle = "#D3D3D3";
                ctx.rect(r_x, r_y, 3.2*size, 1.8*size);
                ctx.stroke();
                
                ctx.fillStyle = "black";
                ctx.textAlign = 'center';
                ctx.fillText(paths[i][j], w, h);

                words_drawn[paths[i][j]] = {x: w, y: h};
                rows_drawn[j]++;
            }
        }
    }

    drawLines(paths, ctx, words_drawn);
}

function drawLines(paths, ctx, positions) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.globalCompositeOperation = "destination-over";

    for (let i = 0; i < paths.length; i++) {
        for (let j = 0; j < paths[i].length-1; j++) { 
            let start = positions[paths[i][j]];    
            let end = positions[paths[i][j+1]];
                
            ctx.beginPath();
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

function getPosition(el) {
    for (var lx=0, ly=0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

function getNeighbors(word, list, parents) {
    let neighbors = [];
    
    for (let i = 0; i < list.length; i++) {
        if (canBeNextWord(word, list[i])) {
            neighbors.push(list[i]);
            addParent(list[i], word, parents);
        }
    }

    return neighbors;
}

function addParent(child, parent, all_parents) {
    if (!all_parents[child]) {
        all_parents[child] = [];
    }

    if (!all_parents[child].includes(parent)) {
        all_parents[child].push(parent);
    }
}

function canBeNextWord(start, next) {
    let counter = 0;

    for (let i = 0; i < start.length; i++) {
        if (start.charAt(i) == next.charAt(i)) counter++;
    }

    return counter == start.length-1;
}

function getPaths(current, parents, path) {
    path.unshift(current);
    
    if (!parents[current]) {
        all_paths.push(path);
        return;
    }

    for (let i = 0; i < parents[current].length; i++) {
        getPaths(parents[current][i], parents, path.slice());
    }
}