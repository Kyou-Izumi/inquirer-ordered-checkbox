import { Separator } from "@inquirer/core";
import { NormalizedChoice } from "../typings/index.js";

export function isSelectable<T>(choice: NormalizedChoice<T> | Separator): choice is NormalizedChoice<T> & { disabled?: false } {
    return !Separator.isSeparator(choice) && !choice.disabled;
}

export function isChecked<T>(choice: NormalizedChoice<T> | Separator): choice is NormalizedChoice<T> & { checked: true } {
    return isSelectable(choice) && Boolean(choice.checked);
}

export function toggle<T>(choice: NormalizedChoice<T> | Separator): NormalizedChoice<T> | Separator {
    return isSelectable(choice) ? { ...choice, checked: !choice.checked } : choice;
}

export function check(checked: boolean) {
    return function <T>(choice: NormalizedChoice<T> | Separator) {
        return isSelectable(choice) ? { ...choice, checked } : choice;
    };
}