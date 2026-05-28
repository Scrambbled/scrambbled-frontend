import type { PlacedTile, PlacedTileLetterOnly } from "./DTOs";

export const placedTileToLetterOnlyPlacedTile = (tile: PlacedTile) => (
    {letter: tile.tile.letter, x: tile.x, y: tile.y} as PlacedTileLetterOnly
)
