export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Iterator returning tuples from [0, 0] to [x - 1, y - 1]
 */
export function* xyIterator(x: number, y: number){
    for(let _y = 0; _y < y; _y++){
        for(let _x = 0; _x < x; _x++){
            yield [_x, _y] as [number, number]
        }
    }
}