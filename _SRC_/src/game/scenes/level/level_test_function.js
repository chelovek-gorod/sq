const levelMap = [
    '...<A-[]>......<A-[]>...',
    '......<A-01><A-51>......',
    '...<A-03><A-SS><A-04>...',
    '<A-01><A-SS><A-SS><A-02>',
    '...<A-03><A-SS><A-04>...',
    '......<A-51><A-02>......',
    '...<A-[]>......<A-[]>...',
]

checkMap(levelMap)

function checkMap(levelMap) {
    const result = {}
    for(let l = levelMap.length - 1; l >= 0; l--) {
        for(let i = levelMap[l].length - 1; i >= 0; i--) {
            if(levelMap[l][i] === '<') {
                const key = +(levelMap[l][i+3] + levelMap[l][i+4])
                if ( !isNaN(key) ) {
                    if (key in result) result[key]++
                    else result[key] = 1
                }
            }
        }
    }
    return result
}