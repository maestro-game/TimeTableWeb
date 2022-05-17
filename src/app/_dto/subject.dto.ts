import {BlockDto} from "./block.dto";

export class SubjectDto {
  constructor(public readonly id: number,
              public readonly name: string,
              public readonly block: BlockDto) {
  }

  static fromJSON(json: any, blocks: Map<number, BlockDto>) : SubjectDto {
    return new SubjectDto(
      json.id,
      json.name,
      blocks.get(json.block)!
    )
  }
}
