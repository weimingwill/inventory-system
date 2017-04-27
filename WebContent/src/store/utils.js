/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
function newIdOfArray(array) {
  return Math.max.apply(Math, array.map(a => a.id)) + 1
}

export {newIdOfArray};