import {Time} from "@angular/common";

export type IndexName = {id: number, name: string}

export class Helper {
  public static toBackEndString(time: Time) {
    let a = time.hours.toString()
    if (a.length < 2) {
      a = '0' + a
    }
    let b = time.minutes.toString()
    if (b.length < 2) {
      b = '0' + b
    }
    return `${a}:${b}:00`
  }
}
