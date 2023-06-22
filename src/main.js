

let cells = []

let startCountCells = 20
let energyForFotosintes = 0
let energyLost = 0
let energyForSex = 0
let energyForEat = 0

const canvasSizeWidth = 800
const canvasSizeHeight = 600

let born = 0
let dead = 0
let count = 0

const getGenes = () => {
    let genes = []
    for( let i = 0; i < 64; i++) {
        genes.push(20)
    }
    return genes
}

const getGenesMutate = (genes) => {
    let newGenes = [...genes]
    const randomYTK = getRandomInt(0, 63)
    const randomGen = getRandomInt(0, 63)
    newGenes[randomYTK] = randomGen
    return newGenes
}

const createCell = (cell, newCells, mutate) => {
    const x = cell.x
    const y = cell.y

    const canMoveCustom = (x,y) => {
        for( let i = 0; i < newCells.length; i++) {
            if (newCells[i].x === x && newCells[i].y === y) return false
        }
        return true
    }

    let flag = false
    let newX = cell.x
    let newY = cell.y
    if (canMoveCustom(x,checkBorderY(y-10))){
        newX = x
        newY = checkBorderY(y-10)
        flag = true
    }
    if (canMoveCustom(checkBorderX(x+10),y)){
        newX = checkBorderX(x+10)
        newY = y
        flag = true
    }
    if (canMoveCustom(checkBorderX(x-10),y)){
        newX = checkBorderX(x-10)
        newY = y
        flag = true
    }
    if (canMoveCustom(x,checkBorderY(y+10))){
        newX = x
        newY = checkBorderY(y+10)
        flag = true
    }
    if (canMoveCustom(checkBorderX(x+10),checkBorderY(y+10))){
        newX = checkBorderX(x+10)
        newY = checkBorderY(y+10)
        flag = true
    }
    if (canMoveCustom(checkBorderX(x-10),checkBorderY(y-10))){
        newX = checkBorderX(x-10)
        newY = checkBorderY(y-10)
        flag = true
    }
    if (canMoveCustom(checkBorderX(x+10),checkBorderY(y-10))){
        newX = checkBorderX(x+10)
        newY = checkBorderY(y-10)
        flag = true
    }
    if (canMoveCustom(checkBorderX(x-10),checkBorderY(y+10))){
        newX = checkBorderX(x-10)
        newY = checkBorderY(y+10)
        flag = true
    }
    if(flag) born++
    if(flag && mutate)  return {genes: getGenesMutate(cell.genes),era: 0, color: '0 0 0', x: newX, y: newY, ytk: 0, energy: 30, photosynthesis: 0, predation: 0, turn: 0, id: Math.floor(Math.random() * 1000000)}
    else if(flag && !mutate) return {genes: [...cell.genes],era: 0, color: '0 0 0', x: newX, y: newY, ytk: 0, energy: 30, photosynthesis: 0, predation: 0, turn: 0, id: Math.floor(Math.random() * 1000000)}
    return false

}


export const initialization = ({energy,lostEnergy,sex,kys,population,type}) => {
    startCountCells = population
    for( let i = 0; i < population; i++) {
        cells.push({genes: getGenes(),era: 0, color: '0 0 0', x: i*10 + 50, y: getRandomInt(0, 63)*10, ytk: 0, energy: 1, photosynthesis: 0, predation: 0, turn: 0, id: Math.floor(Math.random() * 1000000)})
    }
    energyForFotosintes = energy
    energyLost = lostEnergy
    energyForSex = sex
    energyForEat = kys
}

export const progress = () => {
    let newCells = []
    const deadCells = []
    count++
    for( let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        let flag = true
        let checkInfinity = 0
        while (flag) {
            checkInfinity++
            if (cell.ytk > 63) cell.ytk=0
            const command = cell.genes[cell.ytk]

            if (includeGeneralCommand(command)) {
                switch (command) {
                    case 20: // фотосинтез
                        const numberOfNeighbors = energyForFotosintes - getNumberOfNeighbors(cell.id)
                        cell.energy+= numberOfNeighbors
                        cell.photosynthesis+= numberOfNeighbors
                        cell.ytk++
                        flag = false
                        break
                    case 25: // повернуться
                        cell.turn = cell.genes[cell.ytk + 1 > 63 ? 1 : cell.ytk + 1] % 8
                        cell.ytk+=2
                        break
                    case 30: // идти
                        const obj = coordinateMove(cell)
                        if (canMove(obj.x,obj.y)) {
                            cell.x = obj.x > 800 ?  obj.x - 800 : obj.x < 0 ?  800 - obj.x : obj.x
                            cell.y = obj.y > 600 ?  obj.y - 600 : obj.y < 0 ?  600 - obj.y : obj.y
                            flag = false
                        }
                        cell.ytk++
                        break
                    case 35: // кушать
                        const obj3 = coordinateMove(cell)
                        const idEat = canEat(obj3.x,obj3.y)
                        if (idEat) {
                            dead++
                            deadCells.push(idEat)
                            cell.energy+= energyForEat + cells.find(e => e.id === idEat).energy
                            cell.predation+= energyForEat + cells.find(e => e.id === idEat).energy
                            flag = false
                        }
                        cell.ytk++
                        break
                    case 40: // посмотреть
                        cell.turn = getLook(cell)
                        cell.ytk++
                        break
                }
            }else {
                if(cell.ytk + command > 63) cell.ytk = cell.ytk + command - 63
            }
            if (checkInfinity > 100) {
                flag = false
                const numberOfNeighbors = 10 - getNumberOfNeighbors(cell.id)
                cell.energy+= numberOfNeighbors
                cell.photosynthesis+= numberOfNeighbors
                cell.ytk++
            }

        }
        cell.energy-=energyLost
        cell.era++
        if (cell.energy < 0) {
            dead++
            deadCells.push(cell.id)
        }
        else newCells.push(cell)
    }
    newCells = newCells.filter(e => !deadCells.includes(e.id))
    let i = 0
    while (i < newCells.length){
        const cell = newCells[i]
        if (cell.energy > energyForSex) {
            const children = createCell(cell, newCells, false)
            if(children) newCells.push(children)
            const children2 = createCell(cell, newCells, false)
            if(children2) newCells.push(children2)
            const children3 = createCell(cell, newCells, true)
            if(children3) newCells.push(children3)
            newCells[i].energy-= 80
        }
        i++
    }
    cells = newCells

    return cells
}


export const includeGeneralCommand = (command) => {
    return rules.includes(command)
}

const getNumberOfNeighbors = (id) => {
    const x = cells.find( e => e.id === id).x
    const y = cells.find( e => e.id === id).y
    let numberOfNeighbors = 0
    for( let i = 0; i < cells.length; i++) {
        if (cells[i].id !== id) {
            if ( Math.abs(cells[i].x - x) + Math.abs(cells[i].y - y)  <= 20 &&  Math.abs(cells[i].x - x) < 20 && Math.abs(cells[i].y - y)  < 20) numberOfNeighbors++
            if ( Math.abs(cells[i].x - x) + Math.abs(cells[i].y - y)  <= 20 &&  Math.abs(cells[i].x - x) < 20 && Math.abs(cells[i].y - y)  < 20) numberOfNeighbors++
        }
    }
    return numberOfNeighbors
}

const canMove = (x,y) => {
    for( let i = 0; i < cells.length; i++) {
        if (cells[i].x === x && cells[i].y === y) return false
    }
    return true
}


const canEat = (x,y) => {
    for( let i = 0; i < cells.length; i++) {
        if (cells[i].x === x && cells[i].y === y) return cells[i].id
    }
    return false
}

const getLook = (cell) => {
    let min = 1600
    let tern = 0
    for( let i = 0; i < cells.length; i++) {
        if (cells[i].id !== cell.id) {
            if (cells[i].x === cell.x) if (Math.abs(cells[i].y - cell.y) < min)  if(cells[i].y - cell.y > 0) {
                min = Math.abs(cells[i].y - cell.y)
                tern = 2
            } else {
                min = Math.abs(cells[i].y - cell.y)
                tern = 6
            }
            if (cells[i].y === cell.y) if (Math.abs(cells[i].x - cell.x) < min) if (cells[i].x - cell.x > 0) {
                min = Math.abs(cells[i].x - cell.x)
                tern = 0
            }else{
                min = Math.abs(cells[i].x - cell.x)
                tern = 4
            }
            if (cells[i].y - cell.y === cells[i].x - cell.x) if (Math.abs(cells[i].x - cell.x) < min) if (cells[i].y - cell.y > 0) {
                min = Math.abs(cells[i].x - cell.x)
                tern = 1
            } else {
                min = Math.abs(cells[i].x - cell.x)
                tern = 5
            }
            if (cells[i].y - cell.y === -1*(cells[i].x - cell.x)) if (Math.abs(cells[i].x - cell.x) < min) if(cells[i].y - cell.y > 0) {
                min = Math.abs(cells[i].x - cell.x)
                tern = 7
            }else {
                min = Math.abs(cells[i].x - cell.x)
                tern = 3
            }
        }
    }
    return tern
}

const coordinateMove = (cell) => {
    switch (cell.turn) {
        case 0:
            return {x: cell.x, y: cell.y + 10}
        case 1:
            return {x: cell.x + 10, y: cell.y + 10}
        case 2:
            return {x: cell.x + 10, y: cell.y}
        case 3:
            return {x: cell.x + 10, y: cell.y - 10}
        case 4:
            return {x: cell.x, y: cell.y - 10}
        case 5:
            return {x: cell.x - 10, y: cell.y - 10}
        case 6:
            return {x: cell.x - 10, y: cell.y}
        case 7:
            return {x: cell.x - 10, y: cell.y + 10}
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const checkBorderX = (x) =>{
    if (x > canvasSizeWidth) return x - canvasSizeWidth
    if (x < 0) return x + canvasSizeWidth
    return x
}
const checkBorderY = (y) =>{
    if (y > canvasSizeHeight) return y - canvasSizeHeight
    if (y < 0) return y + canvasSizeHeight
    return y
}

export const bornCount = () => {
    return born
}

export const deadCount = () => {
    return dead
}

export const getCount = () => {
    return count
}

const rules = [20, 25, 30, 35, 40]

// 20 - фотосинтез +
// 25 - повернуться
// 30 - идти +
// 35 - кушать +
// 40 - посмотреть

