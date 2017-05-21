/**
 * Created by zhuang_w-pc on 5/19/2017.
 */
function calculateShelvesDistance (shelfA, shelfB) {
  shelfA = shelfA.name;
  shelfB = shelfB.name;
  
  let char = shelfA.charAt(0);
  shelfA = parseInt(shelfA.split(char)[1]);
  shelfB = parseInt(shelfB.split(char)[1]);
  
  let a = parseInt(shelfA / 10);
  let b = parseInt(shelfB / 10);
  
  let distance = Math.abs(a - b);
  distance += Math.abs(distance * 10 + Math.min(shelfA, shelfB) - Math.max(shelfA, shelfB));
  return distance;
}

function getShelvesWithDistances (comparedShelves, allShelves) {
  let addedShelveIds = []
    , shelvesByDistance = {}
    , distance = 0
    , i;
  while (allShelves.length > 0) {
    allShelves = allShelves.filter(shelf => !addedShelveIds.includes(shelf.id));
    shelvesByDistance[distance] = [];
    Array.from(comparedShelves).forEach(shelf => {
      for (i = 0; i < allShelves.length; i++) {
        let thisShelf = allShelves[i];
        if (distance === calculateShelvesDistance(thisShelf, shelf)) {
          if (!addedShelveIds.includes(thisShelf.id)) {
            shelvesByDistance[distance].push(thisShelf);
            addedShelveIds.push(thisShelf.id);
          }
        }
      }
    });
    distance++;
  }
  return shelvesByDistance;
}

function getCellsCapactiy (cells) {
  return cells.map(cell => cell.capacity).reduce((sum, quantity) => {
    return sum + quantity;
  });
}

function getVariantJoinsCapacity (cellVariantJoins) {
  if (cellVariantJoins.length === 0) {
    return 0
  } else {
    return cellVariantJoins.map(cv => cv.quantity).reduce((sum, quantity) => {
      return sum + quantity;
    })
  }
}

function isSameVariant (cellVariantJoins) {
  let isSameVariant = true;
  if (cellVariantJoins.length > 0) {
    let variantId = cellVariantJoins[0].variantId;
    Array.from(cellVariantJoins).forEach(cv => {
      if (variantId !== cv.variantId) {
        isSameVariant = false;
      }
    })
  }
  return isSameVariant;
}

export {
  getShelvesWithDistances,
  getCellsCapactiy,
  getVariantJoinsCapacity,
  isSameVariant
}
